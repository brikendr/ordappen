import { AppComponent } from "./../app/app.component";

describe("Tests for app/app.component.ts", () => {
  let appComponent;
  beforeEach(() => {
    appComponent = new AppComponent();
  });

  it("should have an instance", () => {
    expect(appComponent).toBeDefined();
  });
});
