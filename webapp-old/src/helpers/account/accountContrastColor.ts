import Color from "colorjs.io";

export function accountContrastColor(color: string): string {
    return new Color(color)
        .to("HSL")
        .set({ l: (l) => l >= 50 ? 1 : 100 })
        .toString({ precision: 3, format: "rgb" })
}