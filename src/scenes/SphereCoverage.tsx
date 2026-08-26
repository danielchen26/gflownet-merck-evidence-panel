import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './SphereCoverage.css'

/* ---------------------------------------------------------------------------
   Why the diversity number everyone quotes is the wrong ruler.

   Two synthetic populations in an illustrative chemical space:
     A — one scaffold series (a tight cluster) plus two far outliers
     B — genuine coverage (well-separated chemotypes)

   Internal diversity (mean pairwise distance) rates them almost the same,
   because two extreme points are enough to inflate it. Sphere exclusion
   (#Circles) separates them by ~7x, which is what a chemist actually wants
   to know: how many distinct things can I put on a plate.

   Xie et al. (ICLR 2023) proved IntDiv satisfies only Dissimilarity and
   violates Monotonicity and Subadditivity; #Circles satisfies all three.
   --------------------------------------------------------------------------- */

const D = 0.62 // exclusion distance, stated rather than tuned
const SPACE = 1.0

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

type Pt = [number, number, number]

function clusteredPopulation(): Pt[] {
  const rng = mulberry(0x51ed270b)
  const pts: Pt[] = []
  // one dense series
  for (let i = 0; i < 58; i++) {
    const r = 0.2 * Math.cbrt(rng())
    const th = rng() * Math.PI * 2
    const ph = Math.acos(2 * rng() - 1)
    pts.push([
      -0.1 + r * Math.sin(ph) * Math.cos(th),
      r * Math.cos(ph),
      r * Math.sin(ph) * Math.sin(th),
    ])
  }
  // two extreme outliers — enough to inflate IntDiv on their own
  pts.push([0.92, 0.62, -0.55])
  pts.push([-0.86, -0.58, 0.66])
  return pts
}

function coveringPopulation(): Pt[] {
  const rng = mulberry(0x2f9e44c1)
  const pts: Pt[] = []
  // Fibonacci-ish shell so separations are honest, not lucky
  const n = 22
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const th = i * 2.399963
    const jitter = 0.06
    pts.push([
      r * Math.cos(th) * 0.86 + (rng() - 0.5) * jitter,
      y * 0.78 + (rng() - 0.5) * jitter,
      r * Math.sin(th) * 0.86 + (rng() - 0.5) * jitter,
    ])
  }
  return pts
}

/** Mean pairwise distance, normalised by the space diameter — the IntDiv analogue. */
function intDiv(pts: Pt[]) {
  let s = 0
  let n = 0
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      s += Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2])
      n++
    }
  return n === 0 ? 0 : s / n / (2 * SPACE)
}

/** Greedy sphere exclusion: the packing number at threshold D. */
function circles(pts: Pt[], d: number) {
  const chosen: Pt[] = []
  for (const p of pts) {
    if (chosen.every((c) => Math.hypot(c[0] - p[0], c[1] - p[1], c[2] - p[2]) > d))
      chosen.push(p)
  }
  return chosen
}

function Cloud({
  pts,
  offset,
  showSpheres,
}: {
  pts: Pt[]
  offset: number
  showSpheres: boolean
}) {
  const centers = useMemo(() => circles(pts, D), [pts])
  const geo = useMemo(() => new THREE.SphereGeometry(0.032, 12, 12), [])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ece7de' }), [])

  return (
    <group position={[offset, 0, 0]}>
      {pts.map((p, i) => (
        <mesh key={i} position={p} geometry={geo} material={mat} />
      ))}
      {showSpheres &&
        centers.map((c, i) => (
          <mesh key={`c${i}`} position={c}>
            <icosahedronGeometry args={[D / 2, 2]} />
            <meshBasicMaterial
              color="#4c7df0"
              wireframe
              transparent
              opacity={0.22}
            />
          </mesh>
        ))}
    </group>
  )
}

type Metric = 'intdiv' | 'circles'

export default function SphereCoverage() {
  const [metric, setMetric] = useState<Metric>('intdiv')
  const clustered = useMemo(clusteredPopulation, [])
  const covering = useMemo(coveringPopulation, [])

  const stats = useMemo(
    () => ({
      a: { n: clustered.length, div: intDiv(clustered), circ: circles(clustered, D).length },
      b: { n: covering.length, div: intDiv(covering), circ: circles(covering, D).length },
    }),
    [clustered, covering],
  )

  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const divRatio = stats.a.div / stats.b.div
  const circRatio = stats.b.circ / stats.a.circ

  return (
    <figure className="sc">
      <div className="sc__head">
        <div role="group" aria-label="选择多样性指标" className="sc__toggle">
          <button
            type="button"
            className={metric === 'intdiv' ? 'is-on' : ''}
            aria-pressed={metric === 'intdiv'}
            onClick={() => setMetric('intdiv')}
          >
            IntDiv
          </button>
          <button
            type="button"
            className={metric === 'circles' ? 'is-on' : ''}
            aria-pressed={metric === 'circles'}
            onClick={() => setMetric('circles')}
          >
            #Circles
          </button>
        </div>
        <p className="sc__lede">
          {metric === 'intdiv' ? (
            <>
              两组群体的 <strong>IntDiv 几乎一样</strong>（比值{' '}
              <span className="u-mono">{divRatio.toFixed(2)}</span>
              ）—— 左边那两个极端离群点就足以把均值撑起来。
            </>
          ) : (
            <>
              换成球排除计数，两者差 <strong>{circRatio.toFixed(1)}×</strong>
              。左边整个密集系列只贡献{' '}
              <span className="u-mono">{stats.a.circ}</span> 个可区分点。
            </>
          )}
        </p>
      </div>

      <div className="sc__stage">
        <Canvas camera={{ position: [0, 0.9, 3.35], fov: 44 }} dpr={[1, 2]}>
          <color attach="background" args={['#10131c']} />
          <ambientLight intensity={1} />
          <Cloud pts={clustered} offset={-1.18} showSpheres={metric === 'circles'} />
          <Cloud pts={covering} offset={1.18} showSpheres={metric === 'circles'} />
          <OrbitControls
            makeDefault
            enableDamping={!reduced}
            dampingFactor={0.08}
            enablePan={false}
            minDistance={2.4}
            maxDistance={5.6}
          />
        </Canvas>
        <div className="sc__badge u-mono">模拟 · illustration</div>
      </div>

      <div className="sc__legend">
        <div className="sc__col">
          <span className="u-kicker">A · 单一骨架系列</span>
          <p>{stats.a.n} 个分子，58 个来自同一密集系列 + 2 个极端离群点</p>
          <dl>
            <div>
              <dt>IntDiv 类比</dt>
              <dd className="u-mono">{stats.a.div.toFixed(3)}</dd>
            </div>
            <div>
              <dt>#Circles (D={D})</dt>
              <dd className="u-mono p-refuted">{stats.a.circ}</dd>
            </div>
          </dl>
        </div>
        <div className="sc__col">
          <span className="u-kicker">B · 真实覆盖</span>
          <p>{stats.b.n} 个分子，彼此充分分离</p>
          <dl>
            <div>
              <dt>IntDiv 类比</dt>
              <dd className="u-mono">{stats.b.div.toFixed(3)}</dd>
            </div>
            <div>
              <dt>#Circles (D={D})</dt>
              <dd className="u-mono p-measured">{stats.b.circ}</dd>
            </div>
          </dl>
        </div>
      </div>

      <figcaption className="sc__src u-mono">
        两组群体为示意，用于说明为何 IntDiv 与球排除计数会给出相反的判断。公理依据：
        Xie, Xu, Ma &amp; Mei,{' '}
        <a href="https://openreview.net/forum?id=Yo06F8kfMa1" target="_blank" rel="noreferrer">
          How Much Space Has Been Explored?
        </a>{' '}
        (ICLR 2023) —— IntDiv 只满足 Dissimilarity，违反 Monotonicity 与
        Subadditivity；#Circles 是唯一同时满足三条公理的度量。实测结果见下表。
      </figcaption>
    </figure>
  )
}
