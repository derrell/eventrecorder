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
 * This is a qooxdoo class
 */
qx.Class.define("contrib.cboulanger.eventrecorder.UiController",
{

  extend : qx.ui.window.Window,

  /**
   * Constructor
   */
  construct : function(recorderImplementation, caption="Recorder") {
    this.base(arguments);
    this.set({
      caption,
      width: 200,
      height: 400,
      modal: false,
      showMinimize: false,
      showMaximize: false,
      layout: new qx.ui.layout.VBox(5)
    });

    if (! recorderImplementation instanceof contrib.cboulanger.eventrecorder.AbstractRecorder){
      this.error("Argument must be instanceof contrib.cboulanger.eventrecorder.AbstractRecorder");
      return;
    }
    this._recorder = recorderImplementation;

    let startButton = new qx.ui.form.ToggleButton("Start recording",null);
    startButton.addListener("changeValue", this.toggle, this);
    this._startButton = startButton;
    this.add(startButton);

    let stopButton = new qx.ui.form.Button("Stop & generate script",null);
    stopButton.set({enabled:false});
    stopButton.addListener("execute", this.stop, this);
    this._stopButton = stopButton;
    this.add(stopButton);

    if (recorderImplementation.canReplay()){
      let replayButton = new qx.ui.form.Button("Replay script",null);
      replayButton.set({enabled:false});
      replayButton.addListener("execute", this.replay, this);
      this._replayButton = replayButton;
      this.add(replayButton);
    }

    let codeEditor = new qx.ui.form.TextArea();
    codeEditor.set({
      wrap: false,
      readOnly: true
    });
    this._codeEditor = codeEditor;
    this.add(codeEditor, {flex:1});
  },


  /**
   * The methods and simple properties of this class
   */
  members :
  {
    _recorder : null,
    _startButton : null,
    _stopButton : null,
    _replayButton : null,
    _codeEditor : null,

    toggle(e) {
      this._replayButton.setEnabled(false);
      if (e.getData()) {
        if (this._recorder.isPaused()){
          this._recorder.resume();
        } else {
          this._codeEditor.setValue("");
          this._recorder.excludeIds(qx.core.Id.getAbsoluteIdOf(this));
          this._recorder.start();
        }
        this._startButton.setLabel("Recording, click to pause...");
        this._stopButton.setEnabled(true);
      } else {
        this._recorder.pause();
        this._startButton.setLabel("Continue");
      }
    },

    stop() {
      this._startButton.set({
        enabled: true,
        value: false,
        label: "Start"
      });
      this._stopButton.setEnabled(false);
      this._replayButton.setEnabled(true);
      this._recorder.stop();
      let script = this._recorder.generateScript(this._recorder.getLines());
      this._codeEditor.setValue(script);
    },

    replay() {
      this._recorder.replay(this._recorder.getLines());
    }
  },

  /**
   * Will be called after class has been loaded, before application startup
   */
  defer: function(){
    qx.bom.Lifecycle.onReady(() => {
      const qxRecorder = new contrib.cboulanger.eventrecorder.type.Qooxdoo();
      const qxController = new contrib.cboulanger.eventrecorder.UiController(qxRecorder, "Generate qooxdoo script");
      qxController.set({width:400,height:300});
      qx.core.Init.getApplication().getRoot().add(qxController, {top:0, right:0});
      qxController.show();
    });
  }
});
