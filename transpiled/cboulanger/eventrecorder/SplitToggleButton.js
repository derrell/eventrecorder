(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.SplitButton": {
        "require": true
      },
      "qx.ui.form.IBooleanForm": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.ui.form.ToggleButton": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("cboulanger.eventrecorder.SplitToggleButton", {
    extend: qx.ui.form.SplitButton,
    implement: [qx.ui.form.IBooleanForm, qx.ui.form.IExecutable],

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /** The value of the widget. True, if the widget is checked. */
      value: {
        check: "Boolean",
        nullable: true,
        event: "changeValue",
        init: false
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      // overridden
      _createChildControlImpl: function _createChildControlImpl(id, hash) {
        var control;

        switch (id) {
          case "button":
            control = new qx.ui.form.ToggleButton();
            control.setFocusable(false);
            control.bind("value", this, "value");
            control.addListener("execute", this._onButtonExecute, this);
            this.bind("value", control, "value");

            this._addAt(control, 0, {
              flex: 1
            });

            break;
        }

        return control || cboulanger.eventrecorder.SplitToggleButton.prototype._createChildControlImpl.base.call(this, id);
      }
    }
  });
  cboulanger.eventrecorder.SplitToggleButton.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=SplitToggleButton.js.map?dt=1556283835112