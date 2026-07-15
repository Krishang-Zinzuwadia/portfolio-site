"""Build the original Signal Terminal portfolio asset in Blender.

This script is designed to be executed inside Blender through Blender MCP. It
creates the model from primitives, lights a transparent product render, saves
the editable .blend source, and exports a web-ready GLB.
"""

from pathlib import Path
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

BLEND_PATH = SOURCE_DIR / "krishang-signal-terminal.blend"
GLB_PATH = PUBLIC_MODEL_DIR / "krishang-signal-terminal.glb"
RENDER_PATH = PUBLIC_RENDER_DIR / "krishang-signal-terminal.webp"


def clear_scene():
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
    name,
    color,
    *,
    roughness=0.45,
    metallic=0.0,
    emission=None,
    emission_strength=0.0,
):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (*color, 1.0)

    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic

    if emission:
        emission_input = shader.inputs.get("Emission Color") or shader.inputs.get("Emission")
        strength_input = shader.inputs.get("Emission Strength")
        if emission_input:
            emission_input.default_value = (*emission, 1.0)
        if strength_input:
            strength_input.default_value = emission_strength

    return material


def set_material(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)


def rounded_box(name, dimensions, location, material, *, bevel=0.08, segments=3, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    set_material(obj, material)

    if bevel > 0:
        modifier = obj.modifiers.new(name="Edge softness", type="BEVEL")
        modifier.width = bevel
        modifier.segments = segments
        modifier.limit_method = "ANGLE"
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)

    return obj


def cylinder(name, radius, depth, location, material, *, vertices=64, rotation=(0, 0, 0), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    set_material(obj, material)

    modifier = obj.modifiers.new(name="Edge softness", type="BEVEL")
    modifier.width = min(0.06, depth * 0.2)
    modifier.segments = 3
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def sphere(name, radius, location, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    set_material(obj, material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def make_text(name, body, location, material, size=0.55, extrude=0.016):
    bpy.ops.object.text_add(location=location, rotation=(math.radians(90), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = body
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = extrude
    obj.data.bevel_depth = 0.006
    obj.data.bevel_resolution = 2
    obj.data.materials.append(material)
    bpy.ops.object.convert(target="MESH")
    return obj


def cable(name, points, material, bevel_depth=0.025):
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 10
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


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


clear_scene()

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.film_transparent = True
scene.render.resolution_x = 1200
scene.render.resolution_y = 1200
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.quality = 92
scene.render.filepath = str(RENDER_PATH)

scene.view_settings.look = "AgX - Medium High Contrast"

world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.035, 0.04, 0.03, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.35


# Portfolio palette, translated into physical materials.
paper = make_material("Warm recycled shell", (0.72, 0.66, 0.55), roughness=0.43)
paper_light = make_material("Front face", (0.86, 0.81, 0.70), roughness=0.38)
paper_dark = make_material("Case shadow", (0.43, 0.39, 0.32), roughness=0.52)
ink = make_material("Graphite", (0.027, 0.032, 0.026), roughness=0.28, metallic=0.18)
screen = make_material(
    "Signal glass",
    (0.008, 0.018, 0.013),
    roughness=0.12,
    metallic=0.24,
    emission=(0.01, 0.07, 0.026),
    emission_strength=0.7,
)
acid = make_material(
    "Signal acid",
    (0.48, 1.0, 0.12),
    roughness=0.28,
    emission=(0.48, 1.0, 0.12),
    emission_strength=1.6,
)
blue = make_material(
    "Electric blue",
    (0.09, 0.12, 0.95),
    roughness=0.25,
    metallic=0.1,
    emission=(0.09, 0.12, 0.95),
    emission_strength=0.35,
)
coral = make_material(
    "Alert coral",
    (1.0, 0.18, 0.075),
    roughness=0.32,
    emission=(1.0, 0.12, 0.04),
    emission_strength=0.28,
)
key_light = make_material("Keycaps cream", (0.80, 0.75, 0.64), roughness=0.52)
key_dark = make_material("Keycaps charcoal", (0.06, 0.068, 0.058), roughness=0.38)


root = bpy.data.objects.new("SignalTerminal_Root", None)
bpy.context.collection.objects.link(root)
model_objects = [root]


def add_model_object(obj, parent=root):
    obj.parent = parent
    model_objects.append(obj)
    return obj


# Floating plinth and terminal stand.
add_model_object(rounded_box("Signal_Plinth", (7.1, 5.35, 0.20), (0, -0.72, 0.0), paper_light, bevel=0.28, segments=5))
add_model_object(rounded_box("Plinth_Shadow", (6.82, 5.08, 0.10), (0, -0.65, -0.115), ink, bevel=0.22, segments=4))
add_model_object(rounded_box("Plinth_Signal", (4.8, 0.08, 0.055), (-0.55, -3.405, 0.02), coral, bevel=0.025, segments=2))
add_model_object(rounded_box("Stand_Base", (2.95, 2.15, 0.32), (0, 0.08, 0.29), paper_dark, bevel=0.16, segments=4))
add_model_object(rounded_box("Stand_Top", (2.65, 1.92, 0.22), (0, 0.02, 0.48), paper, bevel=0.12, segments=4))
add_model_object(rounded_box("Stand_Neck", (1.05, 0.88, 0.65), (0, 0.14, 0.82), paper_dark, bevel=0.14, segments=4))


# Main CRT body and its inset face.
add_model_object(rounded_box("Terminal_Case", (3.68, 2.55, 3.08), (0, 0.08, 2.48), paper, bevel=0.30, segments=6))
add_model_object(rounded_box("Terminal_Back", (3.28, 0.34, 2.55), (0, 1.33, 2.53), paper_dark, bevel=0.16, segments=4))
add_model_object(rounded_box("Terminal_Face", (3.46, 0.24, 2.82), (0, -1.245, 2.48), paper_light, bevel=0.22, segments=5))
add_model_object(rounded_box("Terminal_Side_Signal", (0.18, 1.78, 2.18), (1.78, 0.08, 2.57), blue, bevel=0.07, segments=3))


# Screen assembly.
add_model_object(rounded_box("Screen_Recess", (2.88, 0.18, 1.82), (0, -1.395, 2.74), ink, bevel=0.22, segments=6))
add_model_object(rounded_box("Screen_Glass", (2.54, 0.075, 1.48), (0, -1.515, 2.74), screen, bevel=0.17, segments=6))
add_model_object(make_text("Screen_Monogram", "K/Z", (-0.48, -1.575, 2.93), acid, size=0.56, extrude=0.012))
add_model_object(rounded_box("Screen_Bar_A", (0.62, 0.025, 0.055), (0.69, -1.575, 3.05), blue, bevel=0.02, segments=2))
add_model_object(rounded_box("Screen_Bar_B", (0.95, 0.025, 0.055), (0.52, -1.575, 2.88), acid, bevel=0.02, segments=2))
add_model_object(rounded_box("Screen_Bar_C", (0.72, 0.025, 0.055), (0.63, -1.575, 2.71), paper_light, bevel=0.02, segments=2))
add_model_object(rounded_box("Screen_Bar_D", (0.38, 0.025, 0.055), (0.46, -1.575, 2.54), coral, bevel=0.02, segments=2))

for index, z in enumerate((2.48, 2.32, 2.16)):
    add_model_object(
        rounded_box(
            f"Screen_Node_{index + 1}",
            (0.07, 0.025, 0.07),
            (-0.96 + index * 0.16, -1.575, z),
            (acid, blue, coral)[index],
            bevel=0.025,
            segments=3,
        )
    )


# Front controls and vents.
add_model_object(cylinder("Signal_Dial", 0.19, 0.12, (1.18, -1.42, 1.63), ink, rotation=(math.radians(90), 0, 0)))
add_model_object(cylinder("Signal_Dial_Cap", 0.115, 0.14, (1.18, -1.49, 1.63), acid, rotation=(math.radians(90), 0, 0)))
add_model_object(sphere("Power_Light", 0.07, (0.78, -1.51, 1.59), acid))
add_model_object(rounded_box("Drive_Slot", (0.95, 0.07, 0.11), (-0.60, -1.415, 1.64), ink, bevel=0.035, segments=3))
add_model_object(rounded_box("Drive_Eject", (0.12, 0.055, 0.12), (-1.19, -1.42, 1.64), coral, bevel=0.03, segments=3))

vent_parts = []
for index in range(7):
    vent = rounded_box(
        f"Vent_{index + 1}",
        (0.055, 0.055, 0.40),
        (-0.62 + index * 0.18, -1.405, 1.20),
        ink,
        bevel=0.02,
        segments=2,
    )
    vent_parts.append(vent)

bpy.ops.object.select_all(action="DESELECT")
for part in vent_parts:
    part.select_set(True)
bpy.context.view_layer.objects.active = vent_parts[0]
bpy.ops.object.join()
vent_mesh = bpy.context.object
vent_mesh.name = "Speaker_Vents"
add_model_object(vent_mesh)


# Top telemetry module.
add_model_object(rounded_box("Telemetry_Cap", (0.92, 0.75, 0.22), (0.64, 0.18, 4.08), ink, bevel=0.10, segments=4))
add_model_object(cylinder("Telemetry_Antenna", 0.045, 0.48, (0.64, 0.18, 4.42), ink, vertices=24))
add_model_object(sphere("Telemetry_Beacon", 0.13, (0.64, 0.18, 4.69), acid))


# Keyboard body and joined key mesh for a low draw-call export.
add_model_object(rounded_box("Keyboard_Case", (3.58, 1.40, 0.24), (-0.15, -2.47, 0.28), paper_dark, bevel=0.16, segments=4))
add_model_object(rounded_box("Keyboard_Deck", (3.34, 1.18, 0.16), (-0.15, -2.44, 0.42), ink, bevel=0.12, segments=4))

key_parts = []
rows = [12, 12, 11, 10]
for row, count in enumerate(rows):
    spacing = 0.255
    row_width = (count - 1) * spacing
    x_start = -0.15 - row_width / 2
    y = -2.08 - row * 0.24
    for column in range(count):
        material = key_dark if (row + column) % 9 == 0 else key_light
        key_parts.append(
            rounded_box(
                f"Key_{row}_{column}",
                (0.20, 0.17, 0.095),
                (x_start + column * spacing, y, 0.55),
                material,
                bevel=0.035,
                segments=2,
            )
        )

key_parts.append(rounded_box("Spacebar", (1.32, 0.17, 0.095), (-0.15, -2.98, 0.55), key_light, bevel=0.04, segments=2))
key_parts.append(rounded_box("Command_Left", (0.30, 0.17, 0.095), (-1.16, -2.98, 0.55), blue, bevel=0.035, segments=2))
key_parts.append(rounded_box("Command_Right", (0.30, 0.17, 0.095), (0.86, -2.98, 0.55), coral, bevel=0.035, segments=2))

bpy.ops.object.select_all(action="DESELECT")
for key in key_parts:
    key.select_set(True)
bpy.context.view_layer.objects.active = key_parts[0]
bpy.ops.object.join()
keys_mesh = bpy.context.object
keys_mesh.name = "Keyboard_Keys"
add_model_object(keys_mesh)


# Mouse and cables complete the workstation silhouette.
mouse = rounded_box(
    "Signal_Mouse",
    (0.68, 0.90, 0.27),
    (2.34, -2.42, 0.30),
    paper_light,
    bevel=0.19,
    segments=6,
    rotation=(0, 0, math.radians(-12)),
)
add_model_object(mouse)
add_model_object(rounded_box("Mouse_Divide", (0.04, 0.54, 0.03), (2.31, -2.51, 0.445), ink, bevel=0.012, segments=2, rotation=(0, 0, math.radians(-12))))
add_model_object(cylinder("Mouse_Light", 0.045, 0.035, (2.20, -2.61, 0.48), coral, vertices=24))

add_model_object(
    cable(
        "Keyboard_Cable",
        [
            Vector((-1.45, -1.02, 0.67)),
            Vector((-1.78, -1.30, 0.30)),
            Vector((-1.48, -1.77, 0.22)),
            Vector((-1.24, -1.94, 0.36)),
        ],
        ink,
        bevel_depth=0.032,
    )
)
add_model_object(
    cable(
        "Mouse_Cable",
        [
            Vector((1.60, -1.38, 0.46)),
            Vector((2.28, -1.58, 0.22)),
            Vector((2.60, -1.92, 0.20)),
            Vector((2.50, -2.03, 0.30)),
        ],
        ink,
        bevel_depth=0.025,
    )
)


# Camera and studio lighting are saved in the .blend source but excluded from GLB.
camera_data = bpy.data.cameras.new("Signal_Camera")
camera = bpy.data.objects.new("Signal_Camera", camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (7.4, -8.9, 6.25)
camera.data.lens = 60
look_at(camera, (0, -0.78, 2.05))
scene.camera = camera


def add_area_light(name, location, color, energy, size, target):
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


add_area_light("Key_Light", (4.2, -4.8, 8.1), (1.0, 0.84, 0.64), 1050, 5.0, (0, 0, 2.1))
add_area_light("Blue_Fill", (-5.4, -3.0, 4.0), (0.20, 0.28, 1.0), 850, 4.0, (0, 0, 2.0))
add_area_light("Acid_Rim", (1.8, 4.0, 6.4), (0.52, 1.0, 0.18), 1150, 3.0, (0, 0.2, 2.4))
add_area_light("Front_Softbox", (0.0, -6.0, 3.2), (1.0, 0.96, 0.86), 620, 5.5, (0, -0.6, 1.9))


# Save an editable source scene.
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

# Export only the original model hierarchy, without render-only cameras/lights.
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
    export_cameras=False,
    export_lights=False,
    export_animations=False,
)

# Product render used as the graceful no-WebGL/loading fallback.
bpy.ops.object.select_all(action="DESELECT")
bpy.ops.render.render(write_still=True)

print("SIGNAL_TERMINAL_BUILD_COMPLETE")
print(f"blend={BLEND_PATH} bytes={BLEND_PATH.stat().st_size}")
print(f"glb={GLB_PATH} bytes={GLB_PATH.stat().st_size}")
print(f"render={RENDER_PATH} bytes={RENDER_PATH.stat().st_size}")
