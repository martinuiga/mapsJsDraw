var expect = chai.expect;
var assert = chai.assert;

describe("Map", function() {
  describe("Importing GeoJSON", function() {
    it("must exist on the map", function(done) {
      this.timeout(1000);
      setTimeout(function () {
        assert.equal(Object.keys(maps._allAreas).length, Object.keys(geo).length, "is equal");
      }, 1000);
      done();
    });

    it("should delete area from the map", function(done) {
      this.timeout(1000);
      setTimeout(function () {
        maps.deleteAreas(444, true);
      }, 1000);
      assert.equal(Object.keys(maps._allAreas).length, 0, "is equal");
      done();
    });
  });

  // describe("#greets", function() {
  //   it("should throw if no target is passed in", function() {
  //     expect(function() {
  //       (new Cow()).greets();
  //     }).to.throw(Error);
  //   });
  //
  //   it("should greet passed target", function() {
  //     var greetings = (new Cow("Kate")).greets("Baby");
  //     expect(greetings).to.equal("Kate greets Baby");
  //   });
  // });
});