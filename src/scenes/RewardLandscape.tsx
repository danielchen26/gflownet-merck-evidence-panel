import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './RewardLandscape.css'

/* ---------------------------------------------------------------------------
   The signature element.

   A multi-modal reward landscape over an illustrative 2-D chemical space, with
   a population sampled from p(x) ∝ R(x)^β. Dragging β is dragging the only
   knob GFlowNet actually gives you: it interpolates between "cover the modes"
   and "collapse onto the argmax".

   Epistemic hygiene, enforced by construction:
   - The surface and the sampled points are a SIMULATION (labelled as such).
   - β snaps to the five values Kim et al. actually report, so the AUC and
     diversity readout is always a MEASURED number and never an interpolation.
   --------------------------------------------------------------------------- */

/** Measured — Genetic-guided GFlowNets, Kim et al., NeurIPS 2024, Fig. 3.
 *  PMO, 23 oracles, 10k calls. Diversity is Tanimoto internal diversity. */
const BETA_STOPS = [
  { beta: 1, auc: 11.083, div: 0.812 },
  { beta: 5, auc: 14.597, div: 0.67 },
  { beta: 10, auc: 14.735, div: 0.663 },
  { beta: 30, auc: 15.815, div: 0.528 },
  { beta: 50, auc: 16.213, div: 0.432 },
] as const

/** Measured — same figure, same protocol. The bar GFlowNet has to clear. */
const REFERENCES = [
  { label: 'Mol GA', auc: 15.686, div: 0.465 },
  { label: 'REINVENT', auc: 15.185, div: 0.468 },
] as const

const MODES = [
  { x: -0.55, z: -0.34, h: 1.0, s: 0.155 },
  { x: 0.44, z: -0.52, h: 0.83, s: 0.14 },
  { x: 0.08, z: 0.46, h: 0.74, s: 0.175 },
  { x: -0.62, z: 0.56, h: 0.56, s: 0.13 },
  { x: 0.7, z: 0.3, h: 0.44, s: 0.12 },
] as const

const FLOOR = 0.015
const HEIGHT = 1.15
const SURFACE_N = 88
const SAMPLE_N = 64
const POINTS = 520
const MODE_RADIUS = 0.3

function reward(x: number, z: number): number {
  let r = FLOOR
  for (const m of MODES) {
    const dx = x - m.x
    const dz = z - m.z
    r += m.h * Math.exp(-(dx * dx + dz * dz) / (2 * m.s * m.s))
  }
  return r
}

const COLD = new THREE.Color('#2d4f9e')
const WARM = new THREE.Color('#ffb020')

function useSurface() {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(SURFACE_N * SURFACE_N * 3)
    const col = new Float32Array(SURFACE_N * SURFACE_N * 3)
    let maxR = 0
    const rs = new Float32Array(SURFACE_N * SURFACE_N)
    for (let j = 0; j < SURFACE_N; j++) {
      for (let i = 0; i < SURFACE_N; i++) {
        const x = (i / (SURFACE_N - 1)) * 2 - 1
        const z = (j / (SURFACE_N - 1)) * 2 - 1
        const r = reward(x, z)
        rs[j * SURFACE_N + i] = r
        if (r > maxR) maxR = r
      }
    }
    const c = new THREE.Color()
    for (let j = 0; j < SURFACE_N; j++) {
      for (let i = 0; i < SURFACE_N; i++) {
        const k = j * SURFACE_N + i
        const x = (i / (SURFACE_N - 1)) * 2 - 1
        const z = (j / (SURFACE_N - 1)) * 2 - 1
        const t = rs[k] / maxR
        pos[k * 3] = x
        pos[k * 3 + 1] = t * HEIGHT
        pos[k * 3 + 2] = z
        c.copy(COLD).lerp(WARM, Math.pow(t, 0.72))
        col[k * 3] = c.r
        col[k * 3 + 1] = c.g
        col[k * 3 + 2] = c.b
      }
    }
    const idx: number[] = []
    for (let j = 0; j < SURFACE_N - 1; j++) {
      for (let i = 0; i < SURFACE_N - 1; i++) {
        const a = j * SURFACE_N + i
        idx.push(a, a + 1, a + SURFACE_N, a + 1, a + SURFACE_N + 1, a + SURFACE_N)
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    return { geo, maxR }
  }, [])
}

/** Discretised reward grid + cumulative table for inverse-transform sampling. */
function useSampler() {
  return useMemo(() => {
    const cells: { x: number; z: number; r: number }[] = []
    for (let j = 0; j < SAMPLE_N; j++) {
      for (let i = 0; i < SAMPLE_N; i++) {
        const x = ((i + 0.5) / SAMPLE_N) * 2 - 1
        const z = ((j + 0.5) / SAMPLE_N) * 2 - 1
        cells.push({ x, z, r: reward(x, z) })
      }
    }
    const maxR = cells.reduce((m, c) => Math.max(m, c.r), 0)
    return { cells, maxR }
  }, [])
}

type Sampled = { targets: Float32Array; occupied: number; onTop: number }

function sample(
  cells: { x: number; z: number; r: number }[],
  maxR: number,
  beta: number,
  rng: () => number,
): Sampled {
  // Normalise before exponentiating so β=50 stays inside float range.
  const w = new Float64Array(cells.length)
  let total = 0
  for (let i = 0; i < cells.length; i++) {
    const v = Math.pow(cells[i].r / maxR, beta)
    w[i] = v
    total += v
  }
  const cum = new Float64Array(cells.length)
  let acc = 0
  for (let i = 0; i < cells.length; i++) {
    acc += w[i] / total
    cum[i] = acc
  }

  const targets = new Float32Array(POINTS * 3)
  const hit = new Set<number>()
  let onTop = 0
  const jitter = 1 / SAMPLE_N

  for (let p = 0; p < POINTS; p++) {
    const u = rng()
    let lo = 0
    let hi = cum.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cum[mid] < u) lo = mid + 1
      else hi = mid
    }
    const cell = cells[lo]
    const x = cell.x + (rng() - 0.5) * jitter
    const z = cell.z + (rng() - 0.5) * jitter
    targets[p * 3] = x
    targets[p * 3 + 1] = (reward(x, z) / maxR) * HEIGHT + 0.022
    targets[p * 3 + 2] = z

    let best = -1
    let bestD = MODE_RADIUS
    MODES.forEach((m, mi) => {
      const d = Math.hypot(x - m.x, z - m.z)
      if (d < bestD) {
        bestD = d
        best = mi
      }
    })
    if (best >= 0) {
      hit.add(best)
      if (best === 0) onTop++
    }
  }
  return { targets, occupied: hit.size, onTop }
}

/** Deterministic RNG so the same β always yields the same picture. */
function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Population({ beta, reduced }: { beta: number; reduced: boolean }) {
  const { cells, maxR } = useSampler()
  const ref = useRef<THREE.InstancedMesh>(null)
  const current = useRef<Float32Array>(new Float32Array(POINTS * 3))
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const [seeded, setSeeded] = useState(false)

  const { targets } = useMemo(
    () => sample(cells, maxR, beta, mulberry(0x9e3779b9)),
    [cells, maxR, beta],
  )

  useEffect(() => {
    if (!seeded) {
      current.current.set(targets)
      setSeeded(true)
    } else if (reduced) {
      current.current.set(targets)
    }
  }, [targets, seeded, reduced])

  useFrame((_, dt) => {
    const mesh = ref.current
    if (!mesh) return
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6)
    const cur = current.current
    for (let p = 0; p < POINTS; p++) {
      const i = p * 3
      cur[i] += (targets[i] - cur[i]) * k
      cur[i + 1] += (targets[i + 1] - cur[i + 1]) * k
      cur[i + 2] += (targets[i + 2] - cur[i + 2]) * k
      dummy.position.set(cur[i], cur[i + 1], cur[i + 2])
      dummy.updateMatrix()
      mesh.setMatrixAt(p, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, POINTS]} frustumCulled={false}>
      <sphereGeometry args={[0.014, 10, 10]} />
      <meshBasicMaterial color="#ece7de" />
    </instancedMesh>
  )
}

function Surface() {
  const { geo } = useSurface()
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial
          vertexColors
          roughness={0.72}
          metalness={0.08}
          side={THREE.DoubleSide}
          flatShading={false}
        />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#ece7de"
          wireframe
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function RewardLandscape() {
  const [idx, setIdx] = useState(0)
  const stop = BETA_STOPS[idx]
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const { cells, maxR } = useSampler()
  const stats = useMemo(
    () => sample(cells, maxR, stop.beta, mulberry(0x9e3779b9)),
    [cells, maxR, stop.beta],
  )

  const beatsBoth = stop.auc > REFERENCES[0].auc && stop.div > REFERENCES[0].div

  return (
    <figure className="rl">
      <div className="rl__stage">
        <Canvas
          camera={{ position: [2.15, 1.72, 2.15], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#10131c']} />
          <hemisphereLight args={['#8ea2c9', '#0b0e16', 0.5]} />
          <directionalLight position={[3, 5, 2]} intensity={1.15} />
          <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#4c7df0" />
          <Surface />
          <Population beta={stop.beta} reduced={reduced} />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            minDistance={1.9}
            maxDistance={4.6}
            minPolarAngle={0.18}
            maxPolarAngle={1.42}
          />
        </Canvas>

        <div className="rl__badge u-mono">模拟 · illustration</div>
      </div>

      <div className="rl__panel">
        <label className="rl__control" htmlFor="beta">
          <span className="u-kicker">reward 指数 β</span>
          <input
            id="beta"
            type="range"
            min={0}
            max={BETA_STOPS.length - 1}
            step={1}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            aria-valuetext={`β = ${stop.beta}`}
          />
          <output className="rl__beta u-mono" aria-live="polite">
            β = {stop.beta}
          </output>
        </label>

        <p className="rl__note">
          滑块只停在 Kim et al. 论文报告的五个 β 取值上 —— 所以右侧读数始终是{' '}
          <span className="p-measured">实测值</span>，不是插值。
        </p>

        <dl className="rl__readout">
          <div className="rl__row">
            <dt>PMO AUC-top10</dt>
            <dd className="u-mono p-measured">{stop.auc.toFixed(3)}</dd>
          </div>
          <div className="rl__row">
            <dt>Tanimoto diversity</dt>
            <dd className="u-mono p-measured">{stop.div.toFixed(3)}</dd>
          </div>
          <div className="rl__row rl__row--sim">
            <dt>被占据的 mode（共 {MODES.length}）</dt>
            <dd className="u-mono">{stats.occupied}</dd>
          </div>
          <div className="rl__row rl__row--sim">
            <dt>落在最高 mode 上的样本</dt>
            <dd className="u-mono">
              {Math.round((stats.onTop / POINTS) * 100)}%
            </dd>
          </div>
        </dl>

        <div className="rl__refs">
          {REFERENCES.map((r) => (
            <div className="rl__ref u-mono" key={r.label}>
              <span>{r.label}</span>
              <span>
                {r.auc.toFixed(3)} / {r.div.toFixed(3)}
              </span>
            </div>
          ))}
        </div>

        <p className={`rl__verdict ${beatsBoth ? 'is-win' : 'is-loss'}`}>
          {beatsBoth ? (
            <>
              β = {stop.beta}：在 AUC 与 diversity 上{' '}
              <strong>同时</strong>优于 Mol GA 与 REINVENT。这是 GFlowNet
              唯一站得住的加分项，幅度 +
              {(stop.auc - REFERENCES[0].auc).toFixed(3)} AUC。
            </>
          ) : stop.div > REFERENCES[0].div ? (
            <>
              β = {stop.beta}：diversity 高，但 AUC{' '}
              <span className="p-refuted">
                低于 Mol GA {(REFERENCES[0].auc - stop.auc).toFixed(3)}
              </span>
              。多样性是靠放弃性能换来的。
            </>
          ) : (
            <>
              β = {stop.beta}：AUC 最高，但 diversity{' '}
              <span className="p-refuted">
                已跌到 {stop.div.toFixed(3)}，低于 REINVENT 的{' '}
                {REFERENCES[1].div.toFixed(3)}
              </span>
              。要性能就得交出多样性优势。
            </>
          )}
        </p>

        <p className="rl__caveat">
          注意这里的 diversity 是 Tanimoto internal diversity —— 正是 Xie et al.
          (ICLR 2023) 用公理证明违反单调性、"should be avoided as a descriptor for
          exploration"的那个指标。换成 #Circles 后的实测结果见下一节。
        </p>

        <figcaption className="rl__src u-mono">
          曲面与样本为示意；AUC / diversity 取自 Genetic-guided GFlowNets, Kim et
          al., NeurIPS 2024, Fig. 3（PMO 23 oracle · 10k 调用 · 5 seed） ——{' '}
          <a href="https://arxiv.org/abs/2402.05961" target="_blank" rel="noreferrer">
            arxiv.org/abs/2402.05961
          </a>
        </figcaption>
      </div>
    </figure>
  )
}
