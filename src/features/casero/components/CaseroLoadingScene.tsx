'use client';

import type { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { useEffect, useRef } from 'react';

const line = (...points: Vector3[]) => points;

export const CaseroLoadingScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;

    const startScene = async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      try {
        const BABYLON = await import('@babylonjs/core');
        const engine =
          'gpu' in navigator && (await BABYLON.WebGPUEngine.IsSupportedAsync)
            ? new BABYLON.WebGPUEngine(canvas, {
                adaptToDeviceRatio: true,
                antialias: true,
              })
            : new BABYLON.Engine(canvas, true, {
                adaptToDeviceRatio: true,
                antialias: true,
                preserveDrawingBuffer: false,
              });

        if (engine instanceof BABYLON.WebGPUEngine) {
          await engine.initAsync();
        }

        if (!active) {
          engine.dispose();
          return;
        }

        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        scene.ambientColor = new BABYLON.Color3(1, 0.98, 0.94);

        const camera = new BABYLON.ArcRotateCamera(
          'camera',
          Math.PI * 1.22,
          Math.PI / 2.55,
          5.7,
          new BABYLON.Vector3(0, 0.92, 0),
          scene,
        );
        camera.lowerRadiusLimit = 5.2;
        camera.upperRadiusLimit = 7;
        camera.wheelPrecision = 80;
        camera.attachControl(canvas, true);

        const ambientLight = new BABYLON.HemisphericLight(
          'paper-ambient-light',
          new BABYLON.Vector3(0, 1, 0.25),
          scene,
        );
        ambientLight.intensity = 0.92;
        ambientLight.groundColor = new BABYLON.Color3(0.92, 0.9, 0.86);

        const keyLight = new BABYLON.DirectionalLight(
          'paper-key-light',
          new BABYLON.Vector3(-0.35, -0.75, -0.45),
          scene,
        );
        keyLight.intensity = 0.45;

        const group = new BABYLON.TransformNode('casero-house', scene);

        const v = (x: number, y: number, z: number) => new BABYLON.Vector3(x, y, z);
        const edgeColor = new BABYLON.Color4(0.06, 0.055, 0.048, 1);
        const smokeSketch = new BABYLON.Color3(0.38, 0.36, 0.32);
        const paperTone = new BABYLON.Color3(0.99, 0.97, 0.93);
        const roofTone = new BABYLON.Color3(0.97, 0.95, 0.9);
        const glassTone = new BABYLON.Color3(0.93, 0.94, 0.92);
        const paperMaterial = new BABYLON.StandardMaterial('paper-house', scene);
        paperMaterial.diffuseColor = paperTone;
        paperMaterial.ambientColor = paperTone;
        paperMaterial.emissiveColor = paperTone.scale(0.72);
        paperMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        paperMaterial.backFaceCulling = true;

        const roofMaterial = new BABYLON.StandardMaterial('paper-roof', scene);
        roofMaterial.diffuseColor = roofTone;
        roofMaterial.ambientColor = roofTone;
        roofMaterial.emissiveColor = roofTone.scale(0.72);
        roofMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        roofMaterial.backFaceCulling = true;

        const windowMaterial = new BABYLON.StandardMaterial('mirror-window', scene);
        windowMaterial.diffuseColor = glassTone;
        windowMaterial.ambientColor = glassTone;
        windowMaterial.emissiveColor = glassTone.scale(0.55);
        windowMaterial.specularColor = new BABYLON.Color3(0.28, 0.28, 0.26);

        const detailMaterial = new BABYLON.StandardMaterial('ink-detail', scene);
        detailMaterial.diffuseColor = new BABYLON.Color3(0.08, 0.075, 0.065);
        detailMaterial.emissiveColor = new BABYLON.Color3(0.08, 0.075, 0.065);
        detailMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        const outline = (mesh: InstanceType<typeof BABYLON.AbstractMesh>) => {
          mesh.enableEdgesRendering();
          mesh.edgesWidth = 2.8;
          mesh.edgesColor = edgeColor;
          mesh.parent = group;
        };

        const body = BABYLON.MeshBuilder.CreateBox(
          'house-body',
          { depth: 1.55, height: 1.22, width: 2.32 },
          scene,
        );
        body.position.y = 0.61;
        body.material = paperMaterial;
        outline(body);

        const roof = new BABYLON.Mesh('gable-roof', scene);
        const roofData = new BABYLON.VertexData();
        roofData.positions = [
          -1.32, 1.22, -0.9, 1.32, 1.22, -0.9, 0, 2.02, -0.9, -1.32, 1.22, 0.9, 1.32, 1.22, 0.9, 0,
          2.02, 0.9,
        ];
        roofData.indices = [0, 1, 2, 5, 4, 3, 3, 0, 2, 3, 2, 5, 1, 4, 5, 1, 5, 2, 0, 3, 4, 0, 4, 1];
        const roofNormals: number[] = [];
        BABYLON.VertexData.ComputeNormals(roofData.positions, roofData.indices, roofNormals);
        roofData.normals = roofNormals;
        roofData.applyToMesh(roof);
        roof.material = roofMaterial;
        outline(roof);

        const chimneySize = { depth: 0.28, height: 0.78, width: 0.26 };
        const chimneyCenter = new BABYLON.Vector3(-0.72, 1.9, 0.33);
        const chimney = BABYLON.MeshBuilder.CreateBox('chimney', chimneySize, scene);
        chimney.position = chimneyCenter;
        chimney.material = paperMaterial;
        outline(chimney);

        const makeWindow = (name: string, position: Vector3, rotationY = 0) => {
          const pane = BABYLON.MeshBuilder.CreateBox(
            `${name}-pane`,
            { depth: 0.018, height: 0.42, width: 0.42 },
            scene,
          );
          pane.position = position;
          pane.rotation.y = rotationY;
          pane.material = windowMaterial;
          outline(pane);

          const detailZ = position.z - Math.cos(rotationY) * 0.016;
          const detailX = position.x + Math.sin(rotationY) * 0.016;
          const paneCenters = [-0.105, 0.105];
          const frontPaneMarks = paneCenters.flatMap((xOffset) =>
            paneCenters.map((yOffset) =>
              line(
                v(position.x + xOffset - 0.045, position.y + yOffset + 0.045, detailZ),
                v(position.x + xOffset + 0.035, position.y + yOffset + 0.045, detailZ),
                v(position.x + xOffset - 0.035, position.y + yOffset - 0.045, detailZ),
                v(position.x + xOffset + 0.045, position.y + yOffset - 0.045, detailZ),
              ),
            ),
          );
          const sidePaneMarks = paneCenters.flatMap((zOffset) =>
            paneCenters.map((yOffset) =>
              line(
                v(detailX, position.y + yOffset + 0.045, position.z + zOffset - 0.045),
                v(detailX, position.y + yOffset + 0.045, position.z + zOffset + 0.035),
                v(detailX, position.y + yOffset - 0.045, position.z + zOffset - 0.035),
                v(detailX, position.y + yOffset - 0.045, position.z + zOffset + 0.045),
              ),
            ),
          );
          const details = BABYLON.MeshBuilder.CreateLineSystem(
            `${name}-reflection`,
            {
              lines:
                rotationY === 0
                  ? [
                      line(
                        v(position.x, position.y - 0.21, detailZ),
                        v(position.x, position.y + 0.21, detailZ),
                      ),
                      line(
                        v(position.x - 0.21, position.y, detailZ),
                        v(position.x + 0.21, position.y, detailZ),
                      ),
                      ...frontPaneMarks,
                    ]
                  : [
                      line(
                        v(detailX, position.y - 0.21, position.z),
                        v(detailX, position.y + 0.21, position.z),
                      ),
                      line(
                        v(detailX, position.y, position.z - 0.21),
                        v(detailX, position.y, position.z + 0.21),
                      ),
                      ...sidePaneMarks,
                    ],
              updatable: false,
            },
            scene,
          );
          details.color = new BABYLON.Color3(0.08, 0.075, 0.065);
          details.parent = group;
        };

        makeWindow('front-window', new BABYLON.Vector3(0.52, 0.78, -0.786));
        makeWindow('right-window', new BABYLON.Vector3(1.17, 0.82, -0.28), Math.PI / 2);

        const door = BABYLON.MeshBuilder.CreateBox(
          'front-door',
          { depth: 0.024, height: 0.78, width: 0.44 },
          scene,
        );
        door.position = new BABYLON.Vector3(-0.48, 0.39, -0.788);
        door.material = paperMaterial;
        outline(door);

        const knob = BABYLON.MeshBuilder.CreateSphere(
          'door-knob',
          { diameter: 0.045, segments: 8 },
          scene,
        );
        knob.position = new BABYLON.Vector3(-0.34, 0.39, -0.815);
        knob.material = detailMaterial;
        knob.parent = group;

        const smokeOrigin = new BABYLON.Vector3(
          chimneyCenter.x,
          chimneyCenter.y + chimneySize.height / 2 + 0.035,
          chimneyCenter.z,
        );
        const smokeLines = BABYLON.MeshBuilder.CreateLineSystem(
          'chimney-smoke',
          {
            lines: [
              Array.from({ length: 18 }, (_, index) => {
                const t = index / 17;
                return v(
                  smokeOrigin.x + Math.sin(t * Math.PI * 2) * 0.055,
                  smokeOrigin.y + t * 0.55,
                  smokeOrigin.z,
                );
              }),
              Array.from({ length: 18 }, (_, index) => {
                const t = index / 17;
                return v(
                  smokeOrigin.x + Math.sin(t * Math.PI * 2 + Math.PI / 2) * 0.045,
                  smokeOrigin.y + 0.02 + t * 0.45,
                  smokeOrigin.z + 0.02,
                );
              }),
            ],
            updatable: false,
          },
          scene,
        );
        smokeLines.color = smokeSketch;
        smokeLines.parent = group;

        const resize = () => {
          engine.resize();
        };
        window.addEventListener('resize', resize);

        let frame = 0;
        scene.onBeforeRenderObservable.add(() => {
          frame += engine.getDeltaTime() / 1000;
          group.rotation.y = Math.sin(frame * 0.9) * 0.12;
          group.position.y = Math.sin(frame * 2.2) * 0.08;
          smokeLines.position.y = Math.sin(frame * 2.4) * 0.05;
          smokeLines.position.x = Math.sin(frame * 1.3) * 0.012;
          camera.alpha += 0.0008;
        });

        engine.runRenderLoop(() => {
          scene.render();
        });

        cleanup = () => {
          window.removeEventListener('resize', resize);
          scene.dispose();
          engine.dispose();
        };
      } catch {
        // Keep the lightweight text loading state if Babylon cannot start.
      }
    };

    void startScene();

    return () => {
      active = false;
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative flex h-[270px] w-full max-w-[420px] items-center justify-center">
      <canvas
        ref={canvasRef}
        aria-label="Casa 3D cargando"
        className="relative z-10 h-full w-full outline-none"
      />
    </div>
  );
};
