// Everything the arcade games use from three.js, as one global (window.THREE), so the game files stay plain scripts.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

window.THREE = Object.assign({}, THREE, { mergeGeometries, RoundedBoxGeometry, RoomEnvironment });
