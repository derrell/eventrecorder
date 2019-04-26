(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qookery.ILayoutFactory": {
        "require": true
      },
      "qookery.Qookery": {},
      "qx.ui.layout.Grid": {},
      "qx.util.StringSplit": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("qookery.internal.layouts.GridLayoutFactory", {
    extend: qx.core.Object,
    implement: [qookery.ILayoutFactory],
    type: "singleton",
    statics: {
      /* Patch layout with automatic child row-column assignment code*/
      __patchLayout: function __patchLayout(layout, attributes) {
        var configureFunction = function configureFunction(widget) {
          qookery.internal.layouts.GridLayoutFactory.__configureWidget.call(configureFunction, widget);
        };

        configureFunction.rowArray = null;
        configureFunction.currentRow = 0;
        configureFunction.currentColumn = 0;
        var columnCount = attributes.getAttribute("column-count", 1);

        if (columnCount !== "auto") {
          configureFunction.rowArray = [];

          for (var i = 0; i < columnCount; i++) {
            configureFunction.rowArray.push(0);
          }
        }

        layout.configureWidget = configureFunction;
      },

      /* Perform automatic row-column assignment for a new child, if needed */
      __configureWidget: function __configureWidget(widget) {
        var properties = widget.getLayoutProperties();
        if (properties["row"] != null && properties["column"] != null) return;
        var colSpan = properties["colSpan"] || 1;
        var rowSpan = properties["rowSpan"] || 1;

        if (this.rowArray == null) {
          widget.setLayoutProperties({
            row: 0,
            column: this.currentColumn,
            colSpan: colSpan
          });
          this.currentColumn += colSpan;
          return;
        }

        while (this.rowArray[this.currentColumn] > 0) {
          this.rowArray[this.currentColumn]--;
          this.currentColumn++;

          if (this.currentColumn >= this.rowArray.length) {
            this.currentColumn = 0;
            this.currentRow++;
          }
        }

        widget.setLayoutProperties({
          row: this.currentRow,
          column: this.currentColumn,
          colSpan: colSpan,
          rowSpan: rowSpan
        });

        for (var j = 0; j < colSpan; j++) {
          this.rowArray[this.currentColumn] += rowSpan - 1;
          this.currentColumn++;
        }

        if (this.currentColumn >= this.rowArray.length) {
          this.currentColumn = 0;
          this.currentRow++;
        }
      }
    },
    members: {
      createLayout: function createLayout(attributes) {
        var defaultSpacingX = qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_LAYOUT_SPACING_X, 0);
        var defaultSpacingY = qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_LAYOUT_SPACING_Y, 0);
        var layout = new qx.ui.layout.Grid(defaultSpacingX, defaultSpacingY);
        var spacing = attributes.getAttribute("spacing");

        if (spacing != null) {
          layout.setSpacingX(spacing);
          layout.setSpacingY(spacing);
        }

        var spacingX = attributes.getAttribute("spacing-x");
        if (spacingX != null) layout.setSpacingX(spacingX);
        var spacingY = attributes.getAttribute("spacing-y");
        if (spacingY != null) layout.setSpacingY(spacingY);
        var columnFlexes = attributes.getAttribute("column-flexes");
        if (columnFlexes != null) qx.util.StringSplit.split(columnFlexes, /\s+/).forEach(function (columnFlex, index) {
          layout.setColumnFlex(index, parseInt(columnFlex, 10));
        }, this);
        var rowFlexes = attributes.getAttribute("row-flexes");
        if (rowFlexes != null) qx.util.StringSplit.split(rowFlexes, /\s+/).forEach(function (rowFlex, index) {
          layout.setRowFlex(index, parseInt(rowFlex, 10));
        }, this);

        qookery.internal.layouts.GridLayoutFactory.__patchLayout(layout, attributes);

        return layout;
      }
    }
  });
  qookery.internal.layouts.GridLayoutFactory.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=GridLayoutFactory.js.map?dt=1556283810826