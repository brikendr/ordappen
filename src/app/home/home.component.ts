import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { AnimationCurve } from "ui/enums";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user.model";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("menuContainer") menuContainer: ElementRef;
  menuIsOpen: boolean = false;
  menuItems: Array<{ name: string, path: string }> = [];

  private currentPath: string;

  constructor(
    private _router: RouterExtensions,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService.isUserLoggedIn().then((loggedIn: boolean) => {
      if (!loggedIn) {
        return this._router.navigate(["/login"], {
          clearHistory: true
        });
      }
      this._userService.getFirestoreUser().then((user: User) => {
        this.menuItems.push({ name: "Hjem", path: "home/dailyword" });
        user.writePriviledges ? this.menuItems.push({ name: "Nytt Ord", path: "home/new-word" }) : undefined;
        this.menuItems.push({ name: "Profil", path: "home/profile" });
        this.menuItems.push({ name: "Logg ut", path: "logout" });
        this.menuItems.push({ name: "Lukk", path: "" });
      }).catch((err: any) => {
        // TODO: inform user
        console.log('----- Could not get user infor');
      })
    })
  }

  ngAfterViewInit(): void {
    this.initializeMenu();
  }

  navigateToPath(path: string) {
    if (path === "logout") {
      return this.logout();
    }
    if (!path || path === this.currentPath) {
      this.closeMenu();
    } else {
      this._router.navigate([path]).then(
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
    } else {
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

  get gridRowLayout() {
    let layout = "";
    for (let i = 0; i < this.menuItems.length; i++) {
      layout += "*,";
    }
    return layout.slice(0, layout.length - 1);
  }

  logout() {
    this._userService.logOut();
    this._router.navigate(["/login"], {
      clearHistory: true
    });
  }
}
