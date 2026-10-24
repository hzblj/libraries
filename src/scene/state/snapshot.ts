export type SnapshotRegion = {x: number; y: number; width: number; height: number}

export type Snapshot = {image: ImageData; region: SnapshotRegion; ratio: number}

type Request = {
  region: SnapshotRegion
  resolve: (snapshot: Snapshot | null) => void
}

let pending: Request | null = null

export const requestSnapshot = (region: SnapshotRegion) =>
  new Promise<Snapshot | null>(resolve => {
    pending?.resolve(null)
    pending = {region, resolve}
  })

export const cancelSnapshot = () => {
  pending?.resolve(null)
  pending = null
}

export const takeSnapshotRequest = () => {
  const request = pending
  pending = null

  return request
}
