"""Build a proportionally faithful 1990 Macintosh Classic workstation.

This script is intended to run inside Blender through the official
``ahujasid/blender-mcp`` server.  It creates all geometry from Blender
primitives and generated meshes, saves an editable source scene, exports a
web-ready GLB, and renders a transparent WebP fallback.

Reference dimensions (Apple Macintosh Classic technical specifications):

* Computer: 24.6 cm W x 28.5 cm D x 33.6 cm H
* Built-in display: 9-inch diagonal, 512 x 342 monochrome CRT
* Apple Keyboard II: 40.5 cm W x 15.1 cm D x 3.3 cm H, 80 keys
* Apple ADB mouse: 5.3 cm W x 9.7 cm D x 2.8 cm H

Coordinate contract:

* Blender uses X right, Y depth, Z up; the computer faces Blender -Y.
* Blender's glTF Y-up conversion maps that front to glTF / Three.js +Z.
* ``Screen_Anchor`` and four named corner empties are exported for overlays.
"""

from __future__ import annotations

from pathlib import Path
import json
import math

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(r"C:\Users\kingg\imp shit\portfolio-site")
SOURCE_DIR = PROJECT_ROOT / "assets-source" / "blender"
PUBLIC_MODEL_DIR = PROJECT_ROOT / "public" / "assets" / "models"
PUBLIC_RENDER_DIR = PROJECT_ROOT / "public" / "assets" / "blender"

SOURCE_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_MODEL_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_RENDER_DIR.mkdir(parents=True, exist_ok=True)

BLEND_PATH = SOURCE_DIR / "macintosh-classic.blend"
GLB_PATH = PUBLIC_MODEL_DIR / "macintosh-classic.glb"
RENDER_PATH = PUBLIC_RENDER_DIR / "macintosh-classic.webp"

# Official enclosure and peripheral dimensions, in metres.
CASE_WIDTH = 0.246
CASE_DEPTH = 0.285
CASE_HEIGHT = 0.336
KEYBOARD_WIDTH = 0.405
KEYBOARD_DEPTH = 0.151
KEYBOARD_HEIGHT = 0.033
MOUSE_WIDTH = 0.053
MOUSE_DEPTH = 0.097
MOUSE_HEIGHT = 0.028

# Visible glass is slightly smaller than the nominal 9-inch CRT tube.
SCREEN_WIDTH = 0.181
SCREEN_HEIGHT = 0.121
SCREEN_CENTER_Z = 0.236
SCREEN_SURFACE_Y = -0.144


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    for collection in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def make_material(
    name: str,
    color: tuple[float, float, float],
    *,
    roughness: float = 0.45,
    metallic: float = 0.0,
    emission: tuple[float, float, float] | None = None,
    emission_strength: float = 0.0,
) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (*color, 1.0)
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic

    if emission is not None:
        emission_input = shader.inputs.get("Emission Color") or shader.inputs.get("Emission")
        strength_input = shader.inputs.get("Emission Strength")
        if emission_input:
            emission_input.default_value = (*emission, 1.0)
        if strength_input:
            strength_input.default_value = emission_strength
    return material


def set_material(obj: bpy.types.Object, material: bpy.types.Material) -> None:
    obj.data.materials.clear()
    obj.data.materials.append(material)


def apply_bevel(obj: bpy.types.Object, width: float, segments: int = 3) -> None:
    if width <= 0:
        return
    modifier = obj.modifiers.new(name="Moulded edge radius", type="BEVEL")
    modifier.width = width
    modifier.segments = segments
    modifier.limit_method = "ANGLE"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)


def rounded_box(
    name: str,
    dimensions: tuple[float, float, float],
    location: tuple[float, float, float],
    material: bpy.types.Material,
    *,
    bevel: float = 0.004,
    segments: int = 3,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    set_material(obj, material)
    apply_bevel(obj, bevel, segments)
    return obj


def tapered_shell(
    name: str,
    material: bpy.types.Material,
    *,
    front_y: float,
    back_y: float,
    front_width: float,
    back_width: float,
    front_bottom: float,
    front_top: float,
    back_bottom: float,
    back_top: float,
    bevel: float,
) -> bpy.types.Object:
    fw = front_width / 2
    bw = back_width / 2
    vertices = [
        (-fw, front_y, front_bottom),
        (fw, front_y, front_bottom),
        (fw, front_y, front_top),
        (-fw, front_y, front_top),
        (-bw, back_y, back_bottom),
        (bw, back_y, back_bottom),
        (bw, back_y, back_top),
        (-bw, back_y, back_top),
    ]
    faces = [
        (0, 3, 2, 1),
        (4, 5, 6, 7),
        (0, 1, 5, 4),
        (3, 7, 6, 2),
        (0, 4, 7, 3),
        (1, 2, 6, 5),
    ]
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    set_material(obj, material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    apply_bevel(obj, bevel, 5)
    return obj


def cylinder(
    name: str,
    radius: float,
    depth: float,
    location: tuple[float, float, float],
    material: bpy.types.Material,
    *,
    vertices: int = 32,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
    bevel: float = 0.0005,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    set_material(obj, material)
    apply_bevel(obj, min(bevel, depth * 0.24), 2)
    return obj


def make_text(
    name: str,
    body: str,
    location: tuple[float, float, float],
    material: bpy.types.Material,
    *,
    size: float,
    extrude: float = 0.00018,
) -> bpy.types.Object:
    bpy.ops.object.text_add(location=location, rotation=(math.radians(90), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = body
    obj.data.align_x = "LEFT"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = extrude
    obj.data.bevel_depth = extrude * 0.35
    obj.data.bevel_resolution = 2
    obj.data.materials.append(material)
    bpy.ops.object.convert(target="MESH")
    return obj


def make_cable(
    name: str,
    points: list[Vector],
    material: bpy.types.Material,
    *,
    bevel_depth: float = 0.0022,
) -> bpy.types.Object:
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 8
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 3

    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"

    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(obj)
    curve_data.materials.append(material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    return obj


def join_objects(objects: list[bpy.types.Object], name: str) -> bpy.types.Object:
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    joined = bpy.context.object
    joined.name = name
    return joined


def rounded_rectangle_points(
    width: float,
    height: float,
    radius: float,
    corner_segments: int,
) -> list[tuple[float, float]]:
    points: list[tuple[float, float]] = []
    corners = (
        (width / 2 - radius, height / 2 - radius, 0.0),
        (-width / 2 + radius, height / 2 - radius, 90.0),
        (-width / 2 + radius, -height / 2 + radius, 180.0),
        (width / 2 - radius, -height / 2 + radius, 270.0),
    )
    for cx, cz, start_angle in corners:
        for index in range(corner_segments):
            angle = math.radians(start_angle + index * 90.0 / corner_segments)
            points.append((cx + radius * math.cos(angle), cz + radius * math.sin(angle)))
    return points


def curved_crt_glass(
    name: str,
    width: float,
    height: float,
    center_z: float,
    surface_y: float,
    material: bpy.types.Material,
) -> bpy.types.Object:
    perimeter = rounded_rectangle_points(width, height, 0.014, 9)
    ring_scales = (1.0, 0.76, 0.51, 0.27)
    bulge = 0.0035
    vertices: list[tuple[float, float, float]] = []
    for scale in ring_scales:
        y = (surface_y + bulge) - bulge * (1.0 - scale * scale)
        for x, z in perimeter:
            vertices.append((x * scale, y, center_z + z * scale))
    center_index = len(vertices)
    vertices.append((0.0, surface_y, center_z))

    count = len(perimeter)
    faces: list[tuple[int, ...]] = []
    for ring in range(len(ring_scales) - 1):
        outer = ring * count
        inner = (ring + 1) * count
        for index in range(count):
            nxt = (index + 1) % count
            faces.append((outer + index, outer + nxt, inner + nxt, inner + index))
    inner = (len(ring_scales) - 1) * count
    for index in range(count):
        nxt = (index + 1) % count
        faces.append((inner + index, inner + nxt, center_index))

    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    set_material(obj, material)

    solidify = obj.modifiers.new(name="CRT glass thickness", type="SOLIDIFY")
    solidify.thickness = 0.0022
    solidify.offset = -1.0
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=solidify.name)

    bevel = obj.modifiers.new(name="CRT edge softness", type="BEVEL")
    bevel.width = 0.0012
    bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def look_at(obj: bpy.types.Object, target: tuple[float, float, float]) -> None:
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def hierarchy_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    corners: list[Vector] = []
    for obj in objects:
        if obj.type != "MESH":
            continue
        corners.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    minimum = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    maximum = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    return minimum, maximum


clear_scene()

scene = bpy.context.scene
for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue

scene.render.film_transparent = True
scene.render.resolution_x = 1400
scene.render.resolution_y = 1200
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.quality = 94
scene.render.filepath = str(RENDER_PATH)
scene.render.image_settings.color_depth = "8"

try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except TypeError:
    pass
scene.view_settings.exposure = -0.75

world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.055, 0.048, 0.038, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.12


# Warm platinum plastics and restrained late-1980s/early-1990s hardware tones.
case_plastic = make_material("Macintosh Platinum ABS", (0.38, 0.31, 0.20), roughness=0.48)
front_plastic = make_material("Front Bezel Platinum", (0.52, 0.44, 0.30), roughness=0.42)
case_shadow = make_material("Moulding Seams", (0.13, 0.12, 0.095), roughness=0.58)
recess = make_material("CRT Recess", (0.11, 0.12, 0.105), roughness=0.40)
screen_glass = make_material(
    "Monochrome CRT Glass",
    (0.055, 0.078, 0.072),
    roughness=0.17,
    metallic=0.16,
    emission=(0.025, 0.045, 0.037),
    emission_strength=0.16,
)
slot_black = make_material("Drive and Vent Recess", (0.035, 0.034, 0.030), roughness=0.50)
drive_metal = make_material("Floppy Drive Metal", (0.34, 0.35, 0.33), roughness=0.31, metallic=0.58)
keycap = make_material("Keyboard Keycaps", (0.45, 0.40, 0.31), roughness=0.55)
keycap_dark = make_material("Dark Function Keycaps", (0.24, 0.23, 0.20), roughness=0.57)
cable_material = make_material("ADB Cable", (0.36, 0.35, 0.31), roughness=0.62)
port_metal = make_material("Port Metal", (0.40, 0.41, 0.39), roughness=0.29, metallic=0.62)
label_ink = make_material("Classic Label Ink", (0.10, 0.105, 0.095), roughness=0.65)

rainbow_colors = [
    make_material("Apple Green", (0.38, 0.66, 0.22), roughness=0.46),
    make_material("Apple Yellow", (0.93, 0.72, 0.16), roughness=0.46),
    make_material("Apple Orange", (0.93, 0.39, 0.11), roughness=0.46),
    make_material("Apple Red", (0.75, 0.14, 0.13), roughness=0.46),
    make_material("Apple Purple", (0.48, 0.20, 0.48), roughness=0.46),
    make_material("Apple Blue", (0.16, 0.42, 0.70), roughness=0.46),
]


root = bpy.data.objects.new("MacintoshClassic_Root", None)
bpy.context.collection.objects.link(root)
root["reference_model"] = "Apple Macintosh Classic (1990)"
root["case_dimensions_m"] = [CASE_WIDTH, CASE_DEPTH, CASE_HEIGHT]
root["front_direction_gltf"] = [0.0, 0.0, 1.0]
root["screen_center_gltf_m"] = [0.0, SCREEN_CENTER_Z, abs(SCREEN_SURFACE_Y)]
root["screen_visible_size_m"] = [SCREEN_WIDTH, SCREEN_HEIGHT]
model_objects: list[bpy.types.Object] = [root]


def add_model_object(obj: bpy.types.Object, parent: bpy.types.Object = root) -> bpy.types.Object:
    obj.parent = parent
    model_objects.append(obj)
    return obj


# Main compact enclosure: a tapered rear shell, broad front bezel, and rear cap.
add_model_object(
    tapered_shell(
        "Case_Shell",
        case_plastic,
        front_y=-0.128,
        back_y=0.134,
        front_width=0.238,
        back_width=0.211,
        front_bottom=0.000,
        front_top=0.327,
        back_bottom=0.019,
        back_top=0.304,
        bevel=0.0105,
    )
)
add_model_object(
    rounded_box(
        "Front_Bezel",
        (CASE_WIDTH, 0.020, 0.327),
        (0.0, -0.131, 0.1635),
        front_plastic,
        bevel=0.011,
        segments=5,
    )
)
add_model_object(
    rounded_box(
        "Rear_Service_Panel",
        (0.202, 0.014, 0.274),
        (0.0, 0.134, 0.161),
        case_plastic,
        bevel=0.009,
        segments=4,
    )
)

# Front moulding seams and the slight lower chin characteristic of the Classic.
add_model_object(rounded_box("Front_Horizontal_Seam", (0.232, 0.0012, 0.0015), (0, -0.1414, 0.091), case_shadow, bevel=0.0005, segments=2))
add_model_object(rounded_box("Lower_Chin", (0.238, 0.004, 0.064), (0, -0.1400, 0.032), front_plastic, bevel=0.006, segments=4))
add_model_object(rounded_box("Lower_Chin_Seam", (0.224, 0.0014, 0.0014), (0, -0.1420, 0.064), case_shadow, bevel=0.0004, segments=2))

# Top carrying handle recessed between raised shoulders.
add_model_object(rounded_box("Handle_Recess", (0.096, 0.080, 0.006), (0, 0.052, 0.326), case_shadow, bevel=0.006, segments=4))
add_model_object(rounded_box("Top_Shoulder_Left", (0.070, 0.106, 0.018), (-0.083, 0.041, 0.327), case_plastic, bevel=0.008, segments=4))
add_model_object(rounded_box("Top_Shoulder_Right", (0.070, 0.106, 0.018), (0.083, 0.041, 0.327), case_plastic, bevel=0.008, segments=4))
add_model_object(rounded_box("Carry_Handle", (0.096, 0.024, 0.017), (0, 0.080, 0.327), case_plastic, bevel=0.005, segments=4))


# Recessed 9-inch monochrome CRT and a gently convex glass surface.
add_model_object(rounded_box("Screen_Recess", (0.209, 0.006, 0.160), (0, -0.1392, 0.236), recess, bevel=0.015, segments=6))
screen = add_model_object(curved_crt_glass("Screen_Glass", SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_CENTER_Z, SCREEN_SURFACE_Y, screen_glass))
screen["overlay_center_gltf_m"] = [0.0, SCREEN_CENTER_Z, abs(SCREEN_SURFACE_Y)]
screen["overlay_size_m"] = [SCREEN_WIDTH, SCREEN_HEIGHT]
screen["overlay_normal_gltf"] = [0.0, 0.0, 1.0]


# Exported overlay anchors.  Empties do not render, but remain addressable in glTF.
anchor_locations = {
    "Screen_Anchor": (0.0, SCREEN_SURFACE_Y, SCREEN_CENTER_Z),
    "Screen_TopLeft": (-SCREEN_WIDTH / 2, SCREEN_SURFACE_Y, SCREEN_CENTER_Z + SCREEN_HEIGHT / 2),
    "Screen_TopRight": (SCREEN_WIDTH / 2, SCREEN_SURFACE_Y, SCREEN_CENTER_Z + SCREEN_HEIGHT / 2),
    "Screen_BottomLeft": (-SCREEN_WIDTH / 2, SCREEN_SURFACE_Y, SCREEN_CENTER_Z - SCREEN_HEIGHT / 2),
    "Screen_BottomRight": (SCREEN_WIDTH / 2, SCREEN_SURFACE_Y, SCREEN_CENTER_Z - SCREEN_HEIGHT / 2),
}
for name, location in anchor_locations.items():
    empty = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(empty)
    empty.location = location
    empty.empty_display_type = "PLAIN_AXES"
    empty.empty_display_size = 0.004
    add_model_object(empty)


# Front 1.44 MB floppy drive, eject aperture, badge, and product name.
add_model_object(rounded_box("Floppy_Drive_Recess", (0.083, 0.0045, 0.010), (0.046, -0.1413, 0.106), slot_black, bevel=0.0020, segments=3))
add_model_object(rounded_box("Floppy_Drive_Upper_Lip", (0.079, 0.0020, 0.0018), (0.046, -0.1431, 0.1090), drive_metal, bevel=0.0005, segments=2))
add_model_object(rounded_box("Floppy_Drive_Shutter", (0.038, 0.0021, 0.0040), (0.053, -0.1434, 0.1060), drive_metal, bevel=0.0006, segments=2))
add_model_object(cylinder("Floppy_Eject_Pin", 0.00125, 0.0020, (0.100, -0.1428, 0.105), slot_black, vertices=24, rotation=(math.radians(90), 0, 0), bevel=0.0002))

for index, material in enumerate(rainbow_colors):
    add_model_object(
        rounded_box(
            f"Front_Rainbow_{index + 1}",
            (0.0080, 0.0015, 0.00135),
            (-0.096, -0.1422, 0.0788 - index * 0.00135),
            material,
            bevel=0.00045,
            segments=2,
        )
    )
add_model_object(make_text("Macintosh_Classic_Label", "Macintosh Classic", (-0.085, -0.14245, 0.0756), label_ink, size=0.0062))


# Four rows of Snow White-style ventilation slots on both lower side panels.
side_vent_parts: list[bpy.types.Object] = []
for side in (-1, 1):
    x = side * 0.1130
    rotation = (0, math.radians(-90 if side < 0 else 90), 0)
    for row in range(4):
        z = 0.036 + row * 0.0080
        for column in range(12):
            y = -0.078 + column * 0.0120
            side_vent_parts.append(
                rounded_box(
                    f"Side_Vent_{'L' if side < 0 else 'R'}_{row}_{column}",
                    (0.0030, 0.0085, 0.0018),
                    (x, y, z),
                    slot_black,
                    bevel=0.00065,
                    segments=2,
                    rotation=rotation,
                )
            )
join_objects(side_vent_parts, "Side_Lower_Vents")
add_model_object(bpy.context.object)


# Circular speaker grille on the left side, near the front.
speaker_holes: list[bpy.types.Object] = []
for row in range(-3, 4):
    for column in range(-3, 4):
        if row * row + column * column > 11:
            continue
        speaker_holes.append(
            cylinder(
                f"Speaker_Hole_{row}_{column}",
                0.00145,
                0.0024,
                (-0.1146, -0.071 + column * 0.0060, 0.126 + row * 0.0060),
                slot_black,
                vertices=20,
                rotation=(0, math.radians(-90), 0),
                bevel=0.00015,
            )
        )
join_objects(speaker_holes, "Left_Speaker_Grille")
add_model_object(bpy.context.object)


# Rear vent bank and recognizable service/power/I-O silhouettes.
rear_vents: list[bpy.types.Object] = []
for row in range(7):
    for column in range(8):
        rear_vents.append(
            rounded_box(
                f"Rear_Vent_{row}_{column}",
                (0.0070, 0.0024, 0.0022),
                (0.032 + column * 0.0100, 0.1415, 0.157 + row * 0.0080),
                slot_black,
                bevel=0.00065,
                segments=2,
            )
        )
join_objects(rear_vents, "Rear_Vent_Bank")
add_model_object(bpy.context.object)

add_model_object(rounded_box("Rear_Power_Inlet", (0.028, 0.004, 0.035), (0.078, 0.1418, 0.111), slot_black, bevel=0.004, segments=3))
add_model_object(rounded_box("Rear_Power_Switch", (0.029, 0.004, 0.020), (0.078, 0.1419, 0.142), case_shadow, bevel=0.003, segments=3))
add_model_object(rounded_box("Rear_SCSI_Port", (0.048, 0.004, 0.014), (-0.016, 0.1419, 0.048), port_metal, bevel=0.002, segments=2))
add_model_object(rounded_box("Rear_Floppy_Port", (0.040, 0.004, 0.013), (-0.070, 0.1419, 0.048), port_metal, bevel=0.002, segments=2))
for index, x in enumerate((0.039, 0.067)):
    add_model_object(cylinder(f"Rear_MiniDIN_{index + 1}", 0.0070, 0.0030, (x, 0.1420, 0.048), port_metal, vertices=28, rotation=(math.radians(-90), 0, 0), bevel=0.0004))


# Apple Keyboard II, exact overall dimensions and exactly 80 modeled keycaps.
keyboard = add_model_object(
    rounded_box(
        "Apple_Keyboard_II",
        (KEYBOARD_WIDTH, KEYBOARD_DEPTH, 0.022),
        (0, -0.266, 0.011),
        front_plastic,
        bevel=0.009,
        segments=5,
    )
)
keyboard["reference_dimensions_m"] = [KEYBOARD_WIDTH, KEYBOARD_DEPTH, KEYBOARD_HEIGHT]
keyboard["key_count"] = 80
add_model_object(rounded_box("Keyboard_Deck", (0.382, 0.127, 0.006), (0.002, -0.264, 0.022), case_shadow, bevel=0.005, segments=4))

key_parts: list[bpy.types.Object] = []
row_specs = (
    (15, -0.215, -0.052),
    (14, -0.238, -0.057),
    (13, -0.261, -0.062),
    (12, -0.284, -0.067),
)
for row_index, (count, y, center_x) in enumerate(row_specs):
    spacing = 0.0191
    start = center_x - (count - 1) * spacing / 2
    for column in range(count):
        material = keycap_dark if (row_index == 0 and column in (0, 13, 14)) else keycap
        key_parts.append(
            rounded_box(
                f"Key_{row_index}_{column}",
                (0.0167, 0.0168, 0.0105),
                (start + column * spacing, y, 0.0277),
                material,
                bevel=0.0022,
                segments=3,
            )
        )

# Nine bottom-row keys: four modifiers, space bar, and four modifiers/arrows.
bottom_y = -0.307
for index, x in enumerate((-0.183, -0.162, -0.141, -0.120)):
    key_parts.append(rounded_box(f"Bottom_Key_L_{index}", (0.0175, 0.0168, 0.0105), (x, bottom_y, 0.0277), keycap_dark if index == 0 else keycap, bevel=0.0022, segments=3))
key_parts.append(rounded_box("Space_Bar", (0.096, 0.0168, 0.0105), (-0.052, bottom_y, 0.0277), keycap, bevel=0.0025, segments=3))
for index, x in enumerate((0.007, 0.029, 0.051, 0.073)):
    key_parts.append(rounded_box(f"Bottom_Key_R_{index}", (0.0175, 0.0168, 0.0105), (x, bottom_y, 0.0277), keycap_dark if index > 1 else keycap, bevel=0.0022, segments=3))

# Seventeen-key numeric keypad: four rows of four plus a wide zero.
for row in range(4):
    y = -0.224 - row * 0.023
    for column in range(4):
        key_parts.append(
            rounded_box(
                f"Numpad_{row}_{column}",
                (0.0167, 0.0168, 0.0105),
                (0.118 + column * 0.0195, y, 0.0277),
                keycap_dark if column == 3 else keycap,
                bevel=0.0022,
                segments=3,
            )
        )
key_parts.append(rounded_box("Numpad_Zero", (0.0362, 0.0168, 0.0105), (0.1278, -0.316, 0.0277), keycap, bevel=0.0022, segments=3))

assert len(key_parts) == 80, f"Expected 80 keys, built {len(key_parts)}"
keys = join_objects(key_parts, "Keyboard_80_Keys")
keys["key_count"] = 80
add_model_object(keys)

for index, material in enumerate(rainbow_colors):
    add_model_object(
        rounded_box(
            f"Keyboard_Rainbow_{index + 1}",
            (0.009, 0.0016, 0.0011),
            (-0.187, -0.3363, 0.0165 - index * 0.0011),
            material,
            bevel=0.00035,
            segments=2,
        )
    )


# Exact-size one-button ADB mouse, placed to the keyboard's right.
mouse = add_model_object(
    rounded_box(
        "Apple_ADB_One_Button_Mouse",
        (MOUSE_WIDTH, MOUSE_DEPTH, MOUSE_HEIGHT),
        (0.254, -0.267, MOUSE_HEIGHT / 2),
        front_plastic,
        bevel=0.008,
        segments=6,
        rotation=(0, 0, math.radians(-8)),
    )
)
mouse["reference_dimensions_m"] = [MOUSE_WIDTH, MOUSE_DEPTH, MOUSE_HEIGHT]
mouse["button_count"] = 1
add_model_object(rounded_box("Mouse_Single_Button", (0.043, 0.047, 0.006), (0.250, -0.286, 0.026), keycap, bevel=0.0055, segments=5, rotation=(0, 0, math.radians(-8))))
add_model_object(rounded_box("Mouse_Button_Seam", (0.045, 0.0016, 0.0012), (0.251, -0.262, 0.0287), case_shadow, bevel=0.0005, segments=2, rotation=(0, 0, math.radians(-8))))


# ADB cables complete the workstation silhouette.
add_model_object(
    make_cable(
        "Keyboard_ADB_Cable",
        [
            Vector((-0.150, -0.191, 0.017)),
            Vector((-0.172, -0.173, 0.011)),
            Vector((-0.150, -0.153, 0.010)),
            Vector((-0.112, -0.141, 0.030)),
        ],
        cable_material,
        bevel_depth=0.0024,
    )
)
add_model_object(
    make_cable(
        "Mouse_ADB_Cable",
        [
            Vector((0.257, -0.216, 0.015)),
            Vector((0.250, -0.194, 0.009)),
            Vector((0.212, -0.188, 0.008)),
            Vector((0.194, -0.208, 0.016)),
        ],
        cable_material,
        bevel_depth=0.0018,
    )
)


# Render-only studio camera and lights (excluded from the GLB selection).
camera_data = bpy.data.cameras.new("MacintoshClassic_Camera")
camera = bpy.data.objects.new("MacintoshClassic_Camera", camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (-0.62, -1.10, 0.50)
camera.data.lens = 62
camera.data.sensor_width = 36
look_at(camera, (0.025, -0.105, 0.150))
scene.camera = camera


def add_area_light(
    name: str,
    location: tuple[float, float, float],
    color: tuple[float, float, float],
    energy: float,
    size: float,
    target: tuple[float, float, float],
) -> bpy.types.Object:
    light_data = bpy.data.lights.new(name=name, type="AREA")
    light_data.color = color
    light_data.energy = energy
    light_data.shape = "DISK"
    light_data.size = size
    light = bpy.data.objects.new(name, light_data)
    bpy.context.collection.objects.link(light)
    light.location = location
    look_at(light, target)
    return light


add_area_light("Warm_Key", (-0.36, -0.48, 0.72), (1.0, 0.80, 0.58), 72, 0.42, (0, -0.08, 0.17))
add_area_light("Cool_Fill", (0.56, -0.25, 0.42), (0.52, 0.68, 1.0), 34, 0.36, (0.03, -0.10, 0.15))
add_area_light("Top_Softbox", (0.0, 0.02, 0.82), (1.0, 0.94, 0.82), 48, 0.36, (0, -0.05, 0.15))
add_area_light("Rear_Rim", (-0.30, 0.36, 0.46), (0.72, 0.86, 1.0), 36, 0.30, (0, 0.02, 0.18))
add_area_light("Front_Softbox", (0.12, -0.82, 0.28), (1.0, 0.95, 0.86), 22, 0.44, (0.02, -0.11, 0.13))


# Scene-level metadata mirrors the glTF root properties for build diagnostics.
screen_center_gltf = (0.0, SCREEN_CENTER_Z, abs(SCREEN_SURFACE_Y))
screen_corners_gltf = {
    "top_left": (-SCREEN_WIDTH / 2, SCREEN_CENTER_Z + SCREEN_HEIGHT / 2, abs(SCREEN_SURFACE_Y)),
    "top_right": (SCREEN_WIDTH / 2, SCREEN_CENTER_Z + SCREEN_HEIGHT / 2, abs(SCREEN_SURFACE_Y)),
    "bottom_left": (-SCREEN_WIDTH / 2, SCREEN_CENTER_Z - SCREEN_HEIGHT / 2, abs(SCREEN_SURFACE_Y)),
    "bottom_right": (SCREEN_WIDTH / 2, SCREEN_CENTER_Z - SCREEN_HEIGHT / 2, abs(SCREEN_SURFACE_Y)),
}
scene["screen_alignment_json"] = json.dumps(
    {
        "coordinate_space": "glTF root local metres (Y-up, front +Z)",
        "center": screen_center_gltf,
        "size": (SCREEN_WIDTH, SCREEN_HEIGHT),
        "corners": screen_corners_gltf,
    },
    sort_keys=True,
)


# Save editable source, export selected model hierarchy, then render fallback.
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

bpy.ops.object.select_all(action="DESELECT")
for obj in model_objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = root

bpy.ops.export_scene.gltf(
    filepath=str(GLB_PATH),
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_materials="EXPORT",
    export_extras=True,
    export_cameras=False,
    export_lights=False,
    export_animations=False,
)

bpy.ops.object.select_all(action="DESELECT")
bpy.ops.render.render(write_still=True)

minimum, maximum = hierarchy_bounds(model_objects)
dimensions = maximum - minimum

print("MACINTOSH_CLASSIC_BUILD_COMPLETE")
print(f"blend={BLEND_PATH} bytes={BLEND_PATH.stat().st_size}")
print(f"glb={GLB_PATH} bytes={GLB_PATH.stat().st_size}")
print(f"render={RENDER_PATH} bytes={RENDER_PATH.stat().st_size}")
print(f"case_dimensions_m=({CASE_WIDTH:.6f}, {CASE_DEPTH:.6f}, {CASE_HEIGHT:.6f})")
print(f"full_scene_bounds_blender_min={tuple(round(v, 6) for v in minimum)}")
print(f"full_scene_bounds_blender_max={tuple(round(v, 6) for v in maximum)}")
print(f"full_scene_dimensions_m={tuple(round(v, 6) for v in dimensions)}")
print(f"screen_center_gltf_m={screen_center_gltf}")
print(f"screen_size_m=({SCREEN_WIDTH}, {SCREEN_HEIGHT})")
print(f"screen_corners_gltf_m={json.dumps(screen_corners_gltf, sort_keys=True)}")
print("front_direction_gltf=(0.0, 0.0, 1.0)")
