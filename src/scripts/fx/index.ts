/**
 * The effects layer for "MANN / IN MOTION": magnetic pull on the few buttons marked [data-magnetic], fine pointers only.
 * The WebGL signal field and the text decoding of the previous design were removed (DESIGN.md → What changed): the
 * one motif is the lime line, drawn in SVG and CSS. Every effect is progressive enhancement and stops when Motion is off.
 */
import { initPointer } from './pointer';

initPointer();
