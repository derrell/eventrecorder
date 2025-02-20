/* ************************************************************************

  UI Event Recorder

  Copyright:
    2018 Christian Boulanger

  License:
    MIT license
    See the LICENSE file in the project's top-level directory for details.

  Authors: Christian Boulanger


************************************************************************ */

/**
 * This is an event player that works in the client
 */
qx.Class.define("cboulanger.eventrecorder.player.Qooxdoo", {

  extend: cboulanger.eventrecorder.player.Abstract,
  implement: [cboulanger.eventrecorder.IPlayer],

  properties: {
    canReplayInBrowser: {
      refine: true,
      init: true
    }
  },

  members:
  {

    /**
     * @inheritDoc
     */
    getExportFileExtension() {
      return "js";
    },

    /**
     * Translates the intermediate code into the target language
     * @param script
     * @return {string} executable code
     */
    translate(script) {
      let lines = this._translate(script)
        .split(/\n/)
        .map(line => (line.startsWith("(") ? `await ${line};` : line))
        .filter(line => Boolean(line))
        .map(line => "  " + line);
      lines.unshift("async function test() {");
      lines.push("}");
      return lines.join("\n");
    },

    /*
    ============================================================================
       COMMANDS
    ============================================================================
    */

    /**
     * @inheritDoc
     */
    cmd_info(text) {
      if (this.getMode() === "presentation") {
        return `cboulanger.eventrecorder.InfoPane.getInstance().useIcon("info").display("${text}");`;
      }
      return `console.log("${text}");`;
    },

    /**
     * @inheritDoc
     */
    cmd_hide_info(text) {
      if (this.getMode() === "presentation") {
        return `cboulanger.eventrecorder.InfoPane.getInstance().hide();`;
      }
      return "";
    },

    /**
     * @inheritDoc
     */
    cmd_widget_info(id, text) {
      if (this.getMode() === "presentation") {
        return `cboulanger.eventrecorder.InfoPane.getInstance().useIcon("info").display("${text}",qx.core.Id.getQxObject("${id}"));`;
      }
      return "";
    },

    /**
     * Generates code that causes the given delay (in milliseconds).
     * The delay is capped by the {@link #cboulanger.eventrecorder.player.Abstract#maxDelay} property
     * and will only be caused in presentation mode
     * @param delayInMs {Number}
     * @return {string}
     */
    cmd_delay(delayInMs) {
      delayInMs = Math.min(delayInMs, this.getMaxDelay());
      return this.getMode() === "presentation" && delayInMs > 0 ? `(new Promise(resolve => setTimeout(resolve,${delayInMs})))`:"";
    },

    /**
     * Generates code that waits the given time in milliseconds, regardless of player mode
     * @param timeInMs {Number}
     * @return {string}
     */
    cmd_wait(timeInMs) {
      return `(new Promise(resolve => setTimeout(resolve,${timeInMs})))`;
    },

    /**
     * @inheritDoc
     */
    cmd_await_property_value(id, property, value) {
      return this.generateWaitForConditionCode(`JSON.stringify(qx.core.Id.getQxObject("${id}").get${qx.lang.String.firstUp(property)}())==='${JSON.stringify(value).replace(/'/, "\\'")}'`);
    },

    /**
     * @inheritDoc
     */
    cmd_await_property_match_json(id, property, json) {
      if (!qx.lang.Type.isString(json)) {
        json = JSON.stringify(json);
      }
      let regExLiteral = this.createRegexpForJsonComparison(json);
      let timeoutmsg = `Timeout waiting for ID(${id}).${property} to match /${regExLiteral.replace(/\\/, "\\\\").replace(/"/g, "\\\"")}/.`;
      let type = "change" + qx.lang.String.firstUp(property);
      return this.generateWaitForEventCode(id, type, `{verbatim}/${regExLiteral}/`, timeoutmsg);
    },

    /**
     * Generates code that returns a promise which resolves when the object with
     * the given id fires an event with the given name.
     * @param id {String} The id of the object
     * @param type {String} The type of the event
     * @return {*|string}
     */
    cmd_await_event(id, type) {
      if (this.getMode()==="presentation") {
        return this.generateWaitForEventTimoutFunction(id, type, undefined, `if (window["${this._globalRef}"].isRunning()) cboulanger.eventrecorder.InfoPane.getInstance().show().animate(); else return resolve(false)`);
      }
      return this.generateWaitForEventCode(id, type);
    },

    /**
     * @inheritDoc
     */
    cmd_await_event_data(id, type, data) {
      if (data !== undefined) {
        try {
          JSON.stringify(data);
        } catch (e) {
          throw new Error("Data must be serializable to JSON");
        }
      }
      if (this.getMode() === "presentation") {
        return this.generateWaitForEventTimoutFunction(id, type, data, `if (window["${this._globalRef}"].isRunning()) cboulanger.eventrecorder.InfoPane.getInstance().show().animate(); else return resolve();`);
      }
      return this.generateWaitForEventCode(id, type, data);
    },

    /**
     * @inheritDoc
     */
    cmd_await_event_match_json(id, type, json) {
      if (this.getMode()==="presentation") {
        return this.generateWaitForEventTimoutFunction(id, type, json, `if (window["${this._globalRef}"].isRunning()) cboulanger.eventrecorder.InfoPane.getInstance().show().animate(); else return resolve();`);
      }
      return this.generateWaitForEventCode(id, type, json);
    },

    /**
     * Generates code that returns a promise with resolves when the object with the given id becomes visible and rejects
     * if the timeout is reached before that happens.
     * @param id {String}
     * @return {String}
     */
    cmd_assert_appeared(id) {
      return `if(!qx.core.Id.getQxObject("${id}").isVisible()) throw new Error("Failed: Object with id ${id} is not visible.")`;
    },

    /**
     * @deprecated
     */
    cmd_check_appear: this.cmd_assert_appeared,

    /**
     * Generates code that returns a promise with resolves when the object with the given id disappears and rejects
     * if the timeout is reached before that happens.
     * @param id {String}
     * @return {String}
     */
    cmd_assert_disappeared(id) {
      return `if (qx.core.Id.getQxObject("${id}").isVisible()) throw new Error("Failed: Object with id ${id} is visible.")`;
    },

    /**
     * @deprecated
     */
    cmd_check_disappear: this.cmd_assert_disappeared,

    /**
     * @inheritDoc
     * @return {String}
     */
    cmd_execute(id) {
      return `qx.core.Id.getQxObject("${id}").fireEvent("execute");`;
    },

    /**
     * Generates code that fires an event with the given payload on the object with the given id (Button, Command)
     * @param id {String}
     * @param event {String}
     * @param json {*}
     * @return {String}
     */
    cmd_fire(id, event, json) {
      if (json) {
        if (!qx.lang.Type.isString(json)) {
          json = JSON.stringify(json);
        }
        return `qx.core.Id.getQxObject("${id}").fireDataEvent("${event}",${json});`;
      }
      return `qx.core.Id.getQxObject("${id}").fireEvent("${event}");`;
    },

    /**
    * Generates code that fires an `tap` event on the object with the given id (Button, Command)
    * @param id {String}
    * @return {String}
    */
    cmd_tap(id) {
      // doesn't work yet because it needs mouse data etc.
      return "";
      //return `qx.core.Id.getQxObject("${id}").fireEvent("tap", qx.event.type.Tap);`;
    },

    /**
    * Generates code that fires an `dbltap` event on the object with the given id (Button, Command)
    * @param id {String}
    * @return {String}
    */
    cmd_dbltap(id) {
      // doesn't work yet because it needs mouse data etc.
      return "";
      //return `qx.core.Id.getQxObject("${id}").fireEvent("dbltap", qx.event.type.Tap);`;
    },

    /**
     * @inheritDoc
     */
    cmd_set_value(id, data) {
      return `qx.core.Id.getQxObject("${id}").setValue(${JSON.stringify(data)});`;
    },

    /**
     * @inheritDoc
     */
    cmd_await_value(id, value) {
      return this.cmd_await_property_value(id, "value", value);
    },

    /**
     * Generates code that opens a the node with the given node id on the {@link qx.ui.tree.VirtualTree} with the given id
     * @param id {String} The id of the {@link qx.ui.tree.VirtualTree}
     * @param nodeIndex {String|Number} The index of the node in the tree data model
     * @return {String}
     */
    cmd_open_tree_node(id, nodeIndex) {
      return `let t = qx.core.Id.getQxObject("${id}"); t.openNode(t.getLookupTable().getItem(${nodeIndex}));`;
    },

    /**
     * Generates code that closes a the node with the given node id on the {@link qx.ui.tree.VirtualTree} with the given id
     * @param id {String} Id of the {@link qx.ui.treevirtual.TreeVirtual}
     * @param nodeIndex {String|Number} The index of the node in the tree data model
     * @return {String}
     */
    cmd_close_tree_node(id, nodeIndex) {
      return `let t = qx.core.Id.getQxObject("${id}"); t.closeNode(t.getLookupTable().getItem(${nodeIndex}));`;
    },

    /**
     * Generates code that opens a the node with the given node id on the {@link qx.ui.treevirtual.TreeVirtual} with the given id
     * @param id {String} Id of the {@link qx.ui.treevirtual.TreeVirtual}
     * @param nodeIndex {String|Number} The index of the node in the tree data model
     * @return {String}
     */
    cmd_open_tree_node_treevirtual(id, nodeIndex) {
      return `qx.core.Id.getQxObject("${id}").getDataModel().setState(${nodeIndex},{bOpened:true});`;
    },

    /**
     * Generates code that closes a the node with the given node id on the {@link qx.ui.treevirtual.TreeVirtual} with the given id
     * @param id {String} Id of the {@link qx.ui.treevirtual.TreeVirtual}
     * @param nodeIndex {String|Number} The index of the node in the tree data model
     * @return {String}
     */
    cmd_close_tree_node_treevirtual(id, nodeIndex) {
      return `qx.core.Id.getQxObject("${id}").getDataModel().setState(${nodeIndex},{bOpened:false});`;
    },

    /**
     * Generates code that sets a selection for all objects which have a `setSelection` method that
     * takes an array of qooxdoo widgets that should be selected.
     * @param id {String} Id of the object ón which the selection is set
     * @param selectedId {String} The id of the widget that is selected. Only one widget can be selected at this time
     * @return {String}
     */
    cmd_set_selection(id, selectedId) {
      return `qx.core.Id.getQxObject("${id}").setSelection([qx.core.Id.getQxObject("${selectedId}")]);`;
    },

    /**
     * Generates code that awaits a selection for all objects which have a `setSelection` method that
     * takes an array of qooxdoo widgets that should be selected within the timeout
     * @param id {String} Id of the object ón which the selection is set
     * @param selectedId {String} The id of the widget that should be selected
     * @return {String}
     */
    cmd_await_selection(id, selectedId) {
      let timeoutmsg = `Timeout when waiting for selection of object '${selectedId}' on '${id}'.`;
      return this.generateWaitForEventCode(id, "changeSelection", `{verbatim}[qx.core.Id.getQxObject("${selectedId}")]`, timeoutmsg);
    },

    /**
     * Generates code that sets a selection for all (virtual) widgets that have a data model
     * @param id {String} The id of the widget on which the selection is set
     * @param indexArray {Array} An array containing the indexes of the models
     * @return {String}
     */
    cmd_set_model_selection(id, indexArray) {
      return `let o = qx.core.Id.getQxObject("${id}"); o.setSelection(new qx.data.Array(${JSON.stringify(indexArray)}.map(i => o.getModel().getItem(i))));`;
    },

    /**
     * Generates code that awaits a selection for all (virtual) widgets that have a data model
     * @param id {String} The id of the widget on which the selection is set
     * @param indexArray {Array} An array containing the indexes of the models
     * @return {String}
     */
    // cmd_await_model_selection(id, indexArray) {
    //
    //   return `let o = qx.core.Id.getQxObject("${id}"); o.setSelection(new qx.data.Array(${JSON.stringify(indexArray)}.map(i => o.getModel().getItem(i))))`;
    //   return `(waitForEvent(qx.core.Id.getQxObject("${id}").getSelection(), "change",${data}, ${this.getTimeout()}, "${timeoutmsg||"Timeout waiting for event '"+type+"'"}"))`;
    // },

    /**
     * @inheritDoc
     */
    cmd_set_selection_from_selectables(id, index) {
      return `let o = qx.core.Id.getQxObject("${id}"); o.setSelection([o.getSelectables()[${index}]]);`;
    },

    /**
     * @inheritDoc
     */
    cmd_await_selection_from_selectables(id, index) {
      return this.generateWaitForEventCode(id, "changeSelection", `{verbatim}[qx.core.Id.getQxObject("${id}").getSelectables()[${index}]]`);
    },

    /**
     * Resets the selection of a widget that has a `selection` property or a `resetSelection` method.
     * @param id {String} The id of the widget
     * @return {string}
     */
    cmd_reset_selection(id) {
      return `qx.core.Id.getQxObject("${id}").resetSelection();`;
    },

    /**
     * Generates code that sets an selection interval on a {@link qx.ui.table.Table}
     * @param id {String} The id of a {@link qx.ui.table.Table}
     * @param interval {String} The first and the last row to be selected, separated by comma.
     * @return {String}
     */
    cmd_set_table_selection(id, interval) {
      return `qx.core.Id.getQxObject("${id}").addSelectionInterval(${interval});`;
    },

    /**
     * Generates code that set the selection on a {@link qx.ui.virtual.selection.Row} object
     * @param id {String} The id of a qx.ui.virtual.selection.Row object
     * @param rowIndex {String|Number} The index of the row to be selected
     * @return {String}
     */
    cmd_set_row_selection(id, rowIndex) {
      return `qx.core.Id.getQxObject("${id}").selectItem(${rowIndex});`;
    }
  }
});
