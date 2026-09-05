import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Dog = ({ isMenuOpen }) => {
  const model = useGLTF('/models/dog.drc.glb')
  const scrollTimeline = useRef(null)

  useThree(({ camera, scene, gl, viewport }) => {
    const aspect = viewport?.aspect || 1
    camera.position.z = aspect < 1 ? 0.55 + (1 - aspect) * 1.1 : 0.55
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  const { actions } = useAnimations(model.animations, model.scene)
  useEffect(() => {
    if (actions['Take 001']) {
      actions['Take 001'].play()
    }
  }, [actions])

  const [normalMap, sampleMatCap] = useTexture([
    '/models/dog_normals.jpg',
    '/matcap/mat-2.png',
  ]).map((texture) => {
    texture.flipY = false
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const [branchMap, branchNormalMap] = useTexture([
    '/models/branches_diffuse.jpeg',
    '/models/branches_normals.jpeg',
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

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
    mat20,
  ] = useTexture([
    '/matcap/mat-1.png',
    '/matcap/mat-2.png',
    '/matcap/mat-3.png',
    '/matcap/mat-4.png',
    '/matcap/mat-5.png',
    '/matcap/mat-6.png',
    '/matcap/mat-7.png',
    '/matcap/mat-8.png',
    '/matcap/mat-9.png',
    '/matcap/mat-10.png',
    '/matcap/mat-11.png',
    '/matcap/mat-12.png',
    '/matcap/mat-13.png',
    '/matcap/mat-14.png',
    '/matcap/mat-15.png',
    '/matcap/mat-16.png',
    '/matcap/mat-17.png',
    '/matcap/mat-18.png',
    '/matcap/mat-19.png',
    '/matcap/mat-20.png',
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const material = useRef({
    uMatcap1: { value: mat19 },
    uMatcap2: { value: mat2 },
    uProgress: { value: 1.0 },
  })

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: mat2,
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

    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 matcapColor = texture2D( matcap, uv );',
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
  const savedTransform = useRef({
    position: { x: 0.25, y: -0.55, z: 0 },
    rotation: { x: 0, y: Math.PI / 3.9, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  })

  // Smooth transition for position, rotation and scale on menu toggle
  useEffect(() => {
    if (!dogModel.current) return

    if (isMenuOpen) {
      if (scrollTimeline.current?.scrollTrigger) {
        scrollTimeline.current.scrollTrigger.disable(false)
      }
savedTransform.current = {
        position: {
          x: dogModel.current.position.x,
          y: dogModel.current.position.y,
          z: dogModel.current.position.z,
        },
        rotation: {
          x: dogModel.current.rotation.x,
          y: dogModel.current.rotation.y,
          z: dogModel.current.rotation.z,
        },
        scale: {
          x: dogModel.current.scale.x,
          y: dogModel.current.scale.y,
          z: dogModel.current.scale.z,
        },
      }

      // Model position and increased scale for menu view
      gsap.to(dogModel.current.position, {
        x: 0.2,
        y: -0.6,
        z: -0.1,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.to(dogModel.current.scale, {
        x: 1.16,
        y: 1.16,
        z: 1.16,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.to(dogModel.current.rotation, {
        x: Math.PI / 12,
        y: -Math.PI / 2.3,
        z: Math.PI / 18,
        duration: 0.8,
        ease: 'power3.out',
      })
    } else {
      gsap.to(dogModel.current.position, {
        x: savedTransform.current.position.x,
        y: savedTransform.current.position.y,
        z: savedTransform.current.position.z,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          if (scrollTimeline.current?.scrollTrigger) {
            scrollTimeline.current.scrollTrigger.enable()
          }
        },
      })

      gsap.to(dogModel.current.scale, {
        x: savedTransform.current.scale.x,
        y: savedTransform.current.scale.y,
        z: savedTransform.current.scale.z,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.to(dogModel.current.rotation, {
        x: savedTransform.current.rotation.x,
        y: savedTransform.current.rotation.y,
        z: savedTransform.current.rotation.z,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }, [isMenuOpen])

  useEffect(() => {
    const attachHover = (selector, mat) => {
      const elem = document.querySelector(selector)
      if (elem) {
        elem.addEventListener('mouseenter', () => {
          material.current.uMatcap1.value = mat
          gsap.to(material.current.uProgress, {
            value: 0.0,
            duration: 0.3,
            onComplete: () => {
              material.current.uMatcap2.value = material.current.uMatcap1.value
              material.current.uProgress.value = 1.0
            },
          })
        })
      }
    }

    attachHover(`.title[img-title="tomorrowland"]`, mat19)
    attachHover(`.title[img-title="navy-pier"]`, mat8)
    attachHover(`.title[img-title="msi-chicago"]`, mat9)
    attachHover(`.title[img-title="phone"]`, mat12)
    attachHover(`.title[img-title="kikk"]`, mat10)
    attachHover(`.title[img-title="kennedy"]`, mat8)
    attachHover(`.title[img-title="opera"]`, mat13)

    const titlesContainer = document.querySelector(`.titles`)
    if (titlesContainer) {
      titlesContainer.addEventListener('mouseleave', () => {
        material.current.uMatcap1.value = mat2
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            material.current.uMatcap2.value = material.current.uMatcap1.value
            material.current.uProgress.value = 1.0
          },
        })
      })
    }
  }, [mat2, mat8, mat9, mat10, mat12, mat13, mat19])

  useGSAP(() => {
    scrollTimeline.current = gsap.timeline({
      scrollTrigger: {
        trigger: '#section1',
        endTrigger: '#section3',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })
    scrollTimeline.current
      .to(dogModel.current.position, {
        z: '-=0.75',
        y: '+=0.1',
      })
      .to(dogModel.current.rotation, {
        x: `+=${Math.PI / 15}`,
      })
      .to(
        dogModel.current.rotation,
        {
          y: `-=${Math.PI}`,
        },
        'third-animation'
      )
      .to(
        dogModel.current.position,
        {
          x: '-=0.5',
          z: '+=0.6',
          y: '-=0.05',
        },
        'third-animation'
      )

    const updateEyeMaterial = () => {
      const rect = document.querySelector('#section1')?.getBoundingClientRect()
      const inSection1 = rect ? rect.top <= 0 && rect.bottom >= 0 : false
      eyeMeshes.current.forEach((mesh) => {
        mesh.material = inSection1 ? eyeSection1Material : dogMaterial
      })
    }
    updateEyeMaterial()
    gsap.ticker.add(updateEyeMaterial)
    window.addEventListener('resize', updateEyeMaterial)
    return () => {
      gsap.ticker.remove(updateEyeMaterial)
      window.removeEventListener('resize', updateEyeMaterial)
    }
  }, [])

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 3.9, 0]}
      />
      <directionalLight position={[0, 5, 5]} intensity={10} color={'white'} />
    </>
  )
}

export default Dog
