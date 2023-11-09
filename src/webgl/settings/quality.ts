export enum Quality {
   LOW = 0.5,
   MEDIUM = 1,
   OPTIMAL = 2,
}

export const defaultQuality =
   window.innerWidth < 800 ? Quality.MEDIUM : Quality.OPTIMAL;
