import { PaletteColor } from '@mui/material';

declare module '@mui/material/styles' {
    interface TypeBackground {
        accent?: string;
    }

    interface Palette {
        surfaces: {
            glass: string;
            frosted: string;
            elevated: string;
        };
        shadows: {
            soft: string;
            medium: string;
            strong: string;
        };
        interactions: {
            hover: string;
            pressed: string;
            focus: string;
        };
    }

    interface PaletteOptions {
        background?: Partial<TypeBackground>;
        surfaces?: {
            glass?: string;
            frosted?: string;
            elevated?: string;
        };
        shadows?: {
            soft?: string;
            medium?: string;
            strong?: string;
        };
        interactions?: {
            hover?: string;
            pressed?: string;
            focus?: string;
        };
    }
}
