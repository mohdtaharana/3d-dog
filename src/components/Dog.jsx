import React from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, useAnimations } from '@react-three/drei'
import { useEffect,useRef } from 'react'
import {ScrollTrigger} from "gsap/ScrollTrigger";
import gsap from 'gsap'
import{useGSAP} from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Dog = () => {
  // load model
  const model = useGLTF("/models/dog.drc.glb")

  // setup scene

  useThree(({ camera, scene, gl, viewport }) => {
    const aspect = viewport?.aspect || 1
    camera.position.z = aspect < 1 ? 0.55 + (1 - aspect) * 1.1 : 0.55
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  // animation setup

  const {actions} = useAnimations(model.animations, model.scene)
  useEffect(() => {
    actions["Take 001"].play();
  }, [actions])

  // texture loading

  const [normalMap, sampleMatCap] = useTexture([
    "/models/dog_normals.jpg",
    "/matcap/mat-2.png",
   
  ]).map(texture => {
    texture.flipY = false
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

   const [ branchMap, branchNormalMap ] = (useTexture([ "/models/branches_diffuse.jpeg", "/models/branches_normals.jpeg" ]))
        .map(texture => {
            // texture.flipY = false
            texture.colorSpace = THREE.SRGBColorSpace
            return texture
        })


  // materials
    const [
        mat1,
        mat2,
        mat3,
        mat4,
        mat5,
        mat6,
        mat7,
        mat8,
        mat9,
        mat10,
        mat11,
        mat12,
        mat13,
        mat14,
        mat15,
        mat16,
        mat17,
        mat18,
        mat19,
        mat20
    ] = (useTexture([
        "/matcap/mat-1.png",
        "/matcap/mat-2.png",
        "/matcap/mat-3.png",
        "/matcap/mat-4.png",
        "/matcap/mat-5.png",
        "/matcap/mat-6.png",
        "/matcap/mat-7.png",
        "/matcap/mat-8.png",
        "/matcap/mat-9.png",
        "/matcap/mat-10.png",
        "/matcap/mat-11.png",
        "/matcap/mat-12.png",
        "/matcap/mat-13.png",
        "/matcap/mat-14.png",
        "/matcap/mat-15.png",
        "/matcap/mat-16.png",
        "/matcap/mat-17.png",
        "/matcap/mat-18.png",
        "/matcap/mat-19.png",
        "/matcap/mat-20.png",
    ])).map(texture => {
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    })

    const material = useRef({
        uMatcap1: { value: mat19 },
        uMatcap2: { value: mat2 },
        uProgress: { value: 1.0 }
    })

  const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap:mat2,
      })

      const branchMaterial = new THREE.MeshMatcapMaterial({
        normalMap: branchNormalMap,
        map: branchMap,
        matcap: mat2,
      })
 function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

    dogMaterial.onBeforeCompile = onBeforeCompile
    branchMaterial.onBeforeCompile = onBeforeCompile

    const eyeSection1Material = new THREE.MeshMatcapMaterial({ matcap: mat1 })
    const eyeMeshes = useRef([])
    if (eyeMeshes.current.length) eyeMeshes.current.length = 0

      // apply materials to model

  model.scene.traverse((child) => {
    if (!child.isMesh) return
    if (/eye/i.test(child.name)) {
      eyeMeshes.current.push(child)
      child.material = dogMaterial
      return
    }
    child.material = dogMaterial
  })

  const dogModel = useRef(model.scene)


    useEffect(() => {

        document.querySelector(`.title[img-title="tomorrowland"]`).addEventListener("mouseenter", () => {
            material.current.uMatcap1.value = mat19
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.title[img-title="navy-pier"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat8
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.title[img-title="msi-chicago"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat9
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.title[img-title="phone"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat12
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.title[img-title="kikk"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat10
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.title[img-title="kennedy"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat8
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.title[img-title="opera"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat13
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.titles`).addEventListener("mouseleave", () => {

            material.current.uMatcap1.value = mat2
            
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })

    }, [])

useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger:{
      trigger:"#section1",
      endTrigger:"#section3",
      start:"top top",
      end:"bottom bottom",
      scrub:true,
      // markers: true,
    }
  })
  tl.to(dogModel.current.position,{
    z:"-=0.75",
    y:"+=0.1"
  })
  .to(dogModel.current.rotation,{
    x:`+=${Math.PI/15}`
  })
   .to(dogModel.current.rotation,{
    y:`-=${Math.PI}`
  },"third-animation")

  .to(dogModel.current.position,{
    x:"-=0.5",
    z:"+=0.6",
    y:"-=0.05",
  },"third-animation")

  const updateEyeMaterial = () => {
    const rect = document.querySelector("#section1")?.getBoundingClientRect()
    const inSection1 = rect ? rect.top <= 0 && rect.bottom >= 0 : false
    eyeMeshes.current.forEach((mesh) => {
      mesh.material = inSection1 ? eyeSection1Material : dogMaterial
    })
  }
  updateEyeMaterial()
  gsap.ticker.add(updateEyeMaterial)
  window.addEventListener("resize", updateEyeMaterial)
  return () => {
    gsap.ticker.remove(updateEyeMaterial)
    window.removeEventListener("resize", updateEyeMaterial)
  }

},[])

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 3.9, 0]}
      />
      <directionalLight
        position={[0, 5, 5]}
        intensity={10}
        color={"white"}
      />
      {/* <OrbitControls /> */}
    </>
  )
}

export default Dog
