import { create } from "zustand"

export type SpriteRegion = {
    id: string
    name: string
    x: number
    y: number
    width: number
    height: number
}

export type PlacedRegion = {
    id: string
    regionId: string
    squareIndex: number // 0 to 63
    offsetX: number // Offset within the square (percentage or scaled pixels)
    offsetY: number
}

interface MapperStore {
    spriteImage: string | null
    zoom: number
    boardZoom: number // new board zoom state
    isDragging: boolean // active drag state for UI highlighting
    activeDragRegion: string | null // region ID currently being dragged 
    dragOriginOffset: { x: number, y: number } | null // pixel offset where the cursor grabbed the element
    regions: SpriteRegion[]
    placedRegions: PlacedRegion[]

    setSpriteImage: (url: string | null) => void
    setZoom: (zoom: number) => void
    setBoardZoom: (zoom: number) => void
    setIsDragging: (isDragging: boolean) => void
    setActiveDragRegion: (id: string | null) => void
    setDragOriginOffset: (offset: { x: number, y: number } | null) => void
    addRegion: (region: Omit<SpriteRegion, "id">) => void
    updateRegion: (id: string, updates: Partial<SpriteRegion>) => void
    removeRegion: (id: string) => void

    placeRegion: (placed: Omit<PlacedRegion, "id">) => void
    removePlacedRegion: (id: string) => void
    updatePlacedRegion: (id: string, updates: Partial<PlacedRegion>) => void
}

const useMapperStore = create<MapperStore>((set) => ({
    spriteImage: null,
    zoom: 1,
    boardZoom: 3,
    isDragging: false,
    activeDragRegion: null,
    dragOriginOffset: null,
    regions: [],
    placedRegions: [],

    setSpriteImage: (url) => set({ spriteImage: url }),
    setZoom: (zoom) => set({ zoom }),
    setBoardZoom: (boardZoom) => set({ boardZoom }),
    setIsDragging: (isDragging) => set({ isDragging }),
    setActiveDragRegion: (id) => set({ activeDragRegion: id }),
    setDragOriginOffset: (offset) => set({ dragOriginOffset: offset }),
    addRegion: (region) =>
        set((state) => ({
            regions: [
                ...state.regions,
                { ...region, id: crypto.randomUUID() },
            ],
        })),
    updateRegion: (id, updates) =>
        set((state) => ({
            regions: state.regions.map((r) =>
                r.id === id ? { ...r, ...updates } : r,
            ),
        })),
    removeRegion: (id) =>
        set((state) => ({
            regions: state.regions.filter((r) => r.id !== id),
            // Also remove from placed regions when a region is deleted
            placedRegions: state.placedRegions.filter(
                (pr) => pr.regionId !== id,
            ),
        })),

    placeRegion: (placed) =>
        set((state) => ({
            placedRegions: [
                ...state.placedRegions,
                { ...placed, id: crypto.randomUUID() },
            ],
        })),
    removePlacedRegion: (id) =>
        set((state) => ({
            placedRegions: state.placedRegions.filter((pr) => pr.id !== id),
        })),
    updatePlacedRegion: (id, updates) =>
        set((state) => ({
            placedRegions: state.placedRegions.map((pr) =>
                pr.id === id ? { ...pr, ...updates } : pr
            ),
        })),
}))

export default useMapperStore
