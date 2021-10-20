import { Component, OnInit, Input } from '@angular/core';
import { FileView } from 'src/app/models/file_view';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {
  @Input() files: FileView[];

  @Input() id: number | undefined;
  
  slideIndex: number = 0;

  constructor() { }

  ngOnInit(): void { }
  
  openModal(): void {
    document.getElementById('imgModal' + this.id)!.style.display = "block";
  }
  
  closeModal(): void {
    document.getElementById('imgModal' + this.id)!.style.display = "none";
  }
  
  plusSlides(n: number): void {
    this.showSlides(this.slideIndex += n);
  }
  
  currentSlide(n: number): void {
    this.showSlides(this.slideIndex = n);
  }
  
  showSlides(n: number): void {
    let i;
    const slides = document.getElementsByClassName("img-slides-" + this.id) as HTMLCollectionOf <HTMLElement> ;
    if (n > slides.length) {
     this.slideIndex = 1
    }
    if (n < 1) {
     this.slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
     slides[i].style.display = "none";
    }
    slides[this.slideIndex - 1].style.display = "block";
  }
}
