import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular';
import { AnimationCurve } from "ui/enums";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  private currentPath: string;

  @ViewChild("menuContainer") menuContainer: ElementRef;
  menuIsOpen: boolean = false;
  menuItems: { name: string, path: string, color: string }[] = [
    { name: 'Hjem', path: 'home/dailyword', color: '#72DEFF' },
    { name: 'Ny Ord', path: 'home/new-word', color: '#3AEFBA' },
    { name: 'Profile', path: 'home/profile', color: '#3AEFBA' },
    { name: 'Close', path: '', color: '#fff' },
  ];

  constructor(
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    console.log('-=--------------- ON INIT!')
  }

  ngAfterViewInit(): void {
    console.log('-=--------------- AFTER INIT!')
    this.initializeMenu();
  }

  navigateToPath(path: string) {
    // close menu if the path is the same as current path or path is empty (close has empty path)
    if (!path || path === this.currentPath) {
      this.closeMenu();
    }
    else {
      this.routerExtensions.navigate([path]).then(
        () => {
          this.closeMenu();
          this.currentPath = path;
        });
    }
  }

  initializeMenu() {
    // set the origin point for the rotation
    this.menuContainer.nativeElement.originX = 0;
    this.menuContainer.nativeElement.originY = 0;

    this.menuContainer.nativeElement.rotate = - 90;
    this.menuIsOpen = false;
  }

  toggleMenu() {
    if (this.menuIsOpen) {
      this.closeMenu();
    }
    else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menuContainer.nativeElement.animate({
      rotate: 0,
      curve: AnimationCurve.cubicBezier(1, .02, .45, .93),
      duration: 200
    }).then(
      () => {
        this.menuIsOpen = true;
      });
  }

  closeMenu() {
    this.menuContainer.nativeElement.animate({
      rotate: - 90,
      curve: AnimationCurve.cubicBezier(1, .02, .45, .93),
      duration: 200
    }).then(
      () => {
        this.menuIsOpen = false;
      });
  }
}