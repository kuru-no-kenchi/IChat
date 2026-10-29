import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

/*
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.initScene();
  }

  initScene(): void {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
    });

    renderer.setSize(300, 300);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('https://models.readyplayer.me/64b39df64084c3b5c05f9e99.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(1.4, 1.4, 1.4);
      scene.add(model);
    });

    camera.position.z = 1.6;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
} */
