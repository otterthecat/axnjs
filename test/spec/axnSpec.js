  describe("Axn", function(){

    it("should configure internal properties", function(){

      axn.configure({
        root_selector: "body",
      });

      expect(axn.getConfig().root_selector).toBe("body");
    });


    it("should return an object with .getActions()", function(){

      expect(typeof axn.getActions()).toBe("object");
    });

    describe("when adding an action", function(){

      var _test_var = null;

      axn.add("jasmine_test", function(args){

        _test_var = args.content;
      }).ready();

      it ("should create a new internal action", function(){

        expect(typeof axn.getActions("jasmine_test")).toBe("object");
      });

      it("should be retrieveable", function(){

        expect(typeof axn.getFunctions("jasmine_test")).toBe("function");
      });

      it("should store internal data", function(){

        expect(axn.getStoredData("jasmine_test").content).toBe("hello world");
      });

    });

  });