function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "cboulanger.eventrecorder.player.Testcafe": {
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "defer": "runtime",
        "require": true
      },
      "qx.ui.window.Window": {
        "construct": true,
        "require": true
      },
      "qx.util.AliasManager": {
        "construct": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "cboulanger.eventrecorder.Recorder": {
        "construct": true
      },
      "qx.core.Id": {
        "construct": true
      },
      "cboulanger.eventrecorder.player.Qooxdoo": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.ui.menu.Button": {},
      "qx.ui.form.SplitButton": {},
      "cboulanger.eventrecorder.SplitToggleButton": {},
      "cboulanger.eventrecorder.InfoPane": {
        "defer": "runtime"
      },
      "qx.ui.menu.CheckBox": {},
      "qx.ui.form.Button": {},
      "qx.bom.storage.Web": {},
      "qx.util.Uri": {},
      "qx.io.request.Jsonp": {},
      "qx.lang.Type": {},
      "qookery.contexts.Qookery": {},
      "qx.util.ResourceManager": {
        "defer": "runtime"
      },
      "qx.xml.Document": {},
      "qookery.Qookery": {
        "defer": "runtime"
      },
      "qx.event.Timer": {},
      "qx.Interface": {},
      "qx.lang.String": {},
      "dialog.Dialog": {},
      "qx.ui.layout.VBox": {},
      "qx.bom.Lifecycle": {
        "defer": "runtime"
      },
      "qx.core.Init": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "eventrecorder.show_progress": {}
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("cboulanger.eventrecorder.UiController", {
    extend: qx.ui.window.Window,
    statics: {
      CONFIG_KEY: {
        SCRIPT: "eventrecorder.script",
        PLAYER_TYPE: "eventrecorder.player_type",
        PLAYER_MODE: "eventrecorder.player_mode",
        GIST_ID: "eventrecorder.gist_id",
        AUTOPLAY: "eventrecorder.autoplay",
        SHOW_PROGRESS: "eventrecorder.show_progress",
        SCRIPTABLE: "eventrecorder.scriptable",
        RELOAD_BEFORE_REPLAY: "eventrecorder.reload_before_replay",
        SCRIPT_URL: "eventrecorder.script_url"
      },
      FILE_INPUT_ID: "eventrecorder-fileupload",
      aliases: {
        "eventrecorder.icon.record": "cboulanger/eventrecorder/media-record.png",
        "eventrecorder.icon.start": "cboulanger/eventrecorder/media-playback-start.png",
        "eventrecorder.icon.pause": "cboulanger/eventrecorder/media-playback-pause.png",
        "eventrecorder.icon.stop": "cboulanger/eventrecorder/media-playback-stop.png",
        "eventrecorder.icon.edit": "cboulanger/eventrecorder/document-properties.png",
        "eventrecorder.icon.save": "cboulanger/eventrecorder/document-save.png",
        "eventrecorder.icon.load": "cboulanger/eventrecorder/document-open.png",
        "eventrecorder.icon.export": "cboulanger/eventrecorder/emblem-symbolic-link.png"
      }
    },
    properties: {
      /**
       * Current mode
       */
      mode: {
        check: ["player", "recorder"],
        event: "changeMode",
        init: "recorder",
        apply: "_applyMode"
      },

      /**
       * The recorder instance
       */
      recorder: {
        check: "cboulanger.eventrecorder.Recorder",
        event: "changeRecorder",
        nullable: true
      },

      /**
       * The player instance
       */
      player: {
        check: "cboulanger.eventrecorder.IPlayer",
        event: "changePlayer",
        nullable: true
      },

      /**
       * The recorded script
       */
      script: {
        check: "String",
        nullable: true,
        deferredInit: true,
        event: "changeScript",
        apply: "_applyScript"
      },

      /**
       * Whether the stored script should start playing after the
       * application loads
       */
      autoplay: {
        check: "Boolean",
        nullable: false,
        deferredInit: true,
        event: "changeAutoplay",
        apply: "_applyAutoplay"
      },

      /**
       * Whether the application is reloaded before the script is replayed
       */
      reloadBeforeReplay: {
        check: "Boolean",
        nullable: false,
        deferredInit: true,
        event: "changeReloadBeforeReplay",
        apply: "_applyReloadBeforeReplay"
      },

      /**
       * The id of a gist to replay a script from, if any
       */
      gistId: {
        check: "String",
        nullable: true,
        deferredInit: true,
        event: "changeGistId",
        apply: "_applyGistId"
      },

      /**
       * Whether the event recorder is scriptable
       * (only useful for demos of the eventrecorder itself)
       */
      scriptable: {
        check: "Boolean",
        nullable: false,
        deferredInit: true,
        event: "changeScriptable"
      }
    },

    /**
     * Constructor
     * @param caption {String} The caption of the window. Will be used to create
     * an object id.
     * @ignore(env)
     * @ignore(storage)
     * @ignore(uri_params)
     * @ignore(caption)
     */
    construct: function construct() {
      var _this = this;

      var caption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Event Recorder";
      qx.ui.window.Window.constructor.call(this);

      var _this$_getPersistence = this._getPersistenceProviders(),
          env = _this$_getPersistence.env,
          storage = _this$_getPersistence.storage,
          uri_params = _this$_getPersistence.uri_params; // workaround until icon theme can be mixed into application theme


      var aliasMgr = qx.util.AliasManager.getInstance();
      var aliases = aliasMgr.getAliases();

      for (var _i = 0, _Object$entries = Object.entries(cboulanger.eventrecorder.UiController.aliases); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            alias = _Object$entries$_i[0],
            base = _Object$entries$_i[1];

        if (!aliases[alias]) {
          aliasMgr.add(alias, base);
        }
      } //


      this.set({
        caption: caption,
        modal: false,
        showMinimize: false,
        showMaximize: false,
        height: 90,
        layout: new qx.ui.layout.HBox(5),
        allowGrowX: false,
        allowGrowY: false
      });

      this._iniPropertiesFromEnvironment();

      this.__players = {};
      var recorder = new cboulanger.eventrecorder.Recorder();
      this.setRecorder(recorder); // assign id to this widget from caption

      var objectId = caption.replace(/ /g, "").toLocaleLowerCase();
      this.setQxObjectId(objectId);
      qx.core.Id.getInstance().register(this, objectId); // do not record events for this widget unless explicitly requested

      if (!this.getScriptable()) {
        recorder.excludeIds(objectId);
      } // caption


      this.bind("recorder.running", this, "caption", {
        converter: function converter(v) {
          return v ? "Recording ..." : caption;
        }
      });
      this.bind("player.running", this, "caption", {
        converter: function converter(v) {
          return v ? "Replaying ..." : caption;
        }
      }); // this creates the buttons in this order and adds them to the window

      this._createControl("load");

      this._createControl("replay");

      this._createControl("record");

      var stopButton = this._createControl("stop");

      this._createControl("edit");

      this._createControl("save"); // stop button special handling


      var stopButtonState = function stopButtonState() {
        stopButton.setEnabled(recorder.isRunning() || Boolean(_this.getPlayer()) && _this.getPlayer().isRunning());
      };

      recorder.addListener("changeRunning", stopButtonState);
      this.addListener("changePlayer", function (e) {
        if (e.getData()) {
          _this.getPlayer().addListener("changeRunning", stopButtonState);
        }
      }); // form for file uploads

      var form = document.createElement("form");
      form.setAttribute("visibility", "hidden");
      document.body.appendChild(form);
      var input = document.createElement("input");
      input.setAttribute("id", cboulanger.eventrecorder.UiController.FILE_INPUT_ID);
      input.setAttribute("type", "file");
      input.setAttribute("name", "file");
      input.setAttribute("visibility", "hidden");
      form.appendChild(input); // Player configuration

      var playerType = uri_params.queryKey.eventrecorder_type || env.get(cboulanger.eventrecorder.UiController.CONFIG_KEY.PLAYER_TYPE) || "qooxdoo";
      var mode = uri_params.queryKey.eventrecorder_player_mode || storage.getItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.PLAYER_MODE) || env.get(cboulanger.eventrecorder.UiController.CONFIG_KEY.PLAYER_MODE) || "presentation";
      var player = this.getPlayerByType(playerType);
      player.setMode(mode);
      player.addListener("changeMode", function (e) {
        storage.setItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.PLAYER_MODE, e.getData());
      });
      this.setPlayer(player); // Autoplay

      var gistId = this.getGistId();
      var autoplay = this.getAutoplay();
      var script = this.getScript();

      if (gistId && !(script && this._scriptUrlMatches())) {
        this._getRawGist(gistId).then(function (gist) {
          // if the eventrecorder itself is scriptable, run the gist in a separate player without GUI
          if (_this.getScriptable()) {
            var gistplayer = new cboulanger.eventrecorder.player.Qooxdoo();
            gistplayer.setMode(mode);

            if (autoplay) {
              _this.setAutoplay(false);

              gistplayer.replay(gist);
            }
          } else {
            _this.setScript(gist);

            if (autoplay) {
              _this.setAutoplay(false);

              _this.replay();
            }
          }
        })["catch"](function (e) {
          throw new Error("Gist ".concat(gistId, " cannot be loaded: ").concat(e.message, "."));
        });
      } else if (script && autoplay) {
        this.setAutoplay(false);
        this.replay();
      }
    },

    /**
     * The methods and simple properties of this class
     */
    members: {
      /**
       * @var {qx.ui.window.Window}
       */
      __editorWindow: null,
      __players: null,

      /**
       * Internal method to create child controls
       * @param id
       * @return {qx.ui.core.Widget}
       * @private
       */
      _createControl: function _createControl(id) {
        var _this2 = this;

        var control;
        var recorder = this.getRecorder();

        switch (id) {
          /**
           * Load Button
           */
          case "load":
            {
              var loadMenu = new qx.ui.menu.Menu();
              var loadUserGistButton = new qx.ui.menu.Button("Load user gist");
              loadUserGistButton.addListener("execute", this.loadUserGist, this);
              loadUserGistButton.setQxObjectId("fromUserGist");
              loadMenu.add(loadUserGistButton);
              var loadGistByIdButton = new qx.ui.menu.Button("Load gist by id");
              loadGistByIdButton.addListener("execute", this.loadGistById, this);
              loadGistByIdButton.setQxObjectId("fromGistById");
              loadMenu.add(loadGistByIdButton);
              control = new qx.ui.form.SplitButton();
              control.set({
                enabled: false,
                icon: "eventrecorder.icon.load",
                toolTipText: "Load script",
                menu: loadMenu
              });
              control.addOwnedQxObject(loadUserGistButton);
              control.addOwnedQxObject(loadGistByIdButton);
              control.addListener("execute", this.load, this); // enable load button only if player can replay scripts in the browser

              this.bind("recorder.running", control, "enabled", {
                converter: function converter(v) {
                  return !v;
                }
              });
              break;
            }

          /**
           * Replay button
           */

          case "replay":
            {
              control = new cboulanger.eventrecorder.SplitToggleButton();
              var replayMenu = new qx.ui.menu.Menu();
              control.addOwnedQxObject(replayMenu, "menu");
              var macroButton = new qx.ui.menu.Button("Macros");
              replayMenu.add(macroButton);
              var macroMenu = new qx.ui.menu.Menu();
              macroButton.setMenu(macroMenu);
              this.addListener("changePlayer", function () {
                var player = _this2.getPlayer();

                if (!player) {
                  return;
                }

                var updateMenu =
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee2() {
                    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            macroMenu.removeAll();
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context2.prev = 4;

                            _loop = function _loop() {
                              var name = _step.value;
                              var description = player.getMacroDescription(name);
                              var label = description.trim() ? name + ": " + description : name;
                              var menuButton = new qx.ui.menu.Button(label);
                              menuButton.addListener("execute",
                              /*#__PURE__*/
                              _asyncToGenerator(
                              /*#__PURE__*/
                              regeneratorRuntime.mark(function _callee() {
                                var macro;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        macro = player.getMacroDefinition(name).join("\n");
                                        _context.next = 3;
                                        return player.replay(macro);

                                      case 3:
                                        cboulanger.eventrecorder.InfoPane.getInstance().hide();

                                      case 4:
                                      case "end":
                                        return _context.stop();
                                    }
                                  }
                                }, _callee);
                              })));
                              macroMenu.add(menuButton);
                            };

                            for (_iterator = player.getMacroNames().toArray()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                              _loop();
                            }

                            _context2.next = 13;
                            break;

                          case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2["catch"](4);
                            _didIteratorError = true;
                            _iteratorError = _context2.t0;

                          case 13:
                            _context2.prev = 13;
                            _context2.prev = 14;

                            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                              _iterator["return"]();
                            }

                          case 16:
                            _context2.prev = 16;

                            if (!_didIteratorError) {
                              _context2.next = 19;
                              break;
                            }

                            throw _iteratorError;

                          case 19:
                            return _context2.finish(16);

                          case 20:
                            return _context2.finish(13);

                          case 21:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, null, [[4, 9, 13, 21], [14,, 16, 20]]);
                  }));

                  return function updateMenu() {
                    return _ref.apply(this, arguments);
                  };
                }();

                player.addListener("changeMacros", function () {
                  updateMenu();
                  player.getMacros().getNames().addListener("change", updateMenu);
                });
              });
              replayMenu.addSeparator();
              replayMenu.add(new qx.ui.menu.Button("Options:"));
              var optionReload = new qx.ui.menu.CheckBox("Reload page before replay");
              this.bind("reloadBeforeReplay", optionReload, "value");
              optionReload.bind("value", this, "reloadBeforeReplay");
              replayMenu.add(optionReload);
              control.addListener("execute", this._startReplay, this);
              control.set({
                enabled: false,
                icon: "eventrecorder.icon.start",
                toolTipText: "Replay script",
                menu: replayMenu
              }); // show replay button only if player is attached and if it can replay a script in the browser

              this.bind("player", control, "visibility", {
                converter: function converter(player) {
                  return Boolean(player) && player.getCanReplayInBrowser() ? "visible" : "excluded";
                }
              });
              this.bind("recorder.running", control, "enabled", {
                converter: function converter(v) {
                  return !v;
                }
              });
              this.bind("player.running", control, "value");
              break;
            }

          /**
           * Record Button
           */

          case "record":
            {
              var recordMenu = new qx.ui.menu.Menu();
              recordMenu.add(new qx.ui.menu.Button("Options:"));
              var debugEvents = new qx.ui.menu.CheckBox("Log event data");
              debugEvents.bind("value", this, "recorder.logEvents");
              recordMenu.add(debugEvents);
              control = new cboulanger.eventrecorder.SplitToggleButton();
              control.setIcon("eventrecorder.icon.record");
              control.setMenu(recordMenu);
              control.addListener("changeValue", this._toggleRecord, this);
              recorder.bind("running", control, "value");
              recorder.bind("running", control, "enabled", {
                converter: function converter(v) {
                  return !v;
                }
              });
              this.bind("mode", control, "enabled", {
                converter: function converter(v) {
                  return v === "recorder";
                }
              });
              break;
            }

          /**
           * Stop Button
           */

          case "stop":
            {
              control = new qx.ui.form.Button();
              control.set({
                enabled: false,
                icon: "eventrecorder.icon.stop",
                toolTipText: "Stop recording"
              });
              control.addListener("execute", this.stop, this);
              break;
            }

          /**
           * Edit Button
           */

          case "edit":
            {
              control = new qx.ui.form.Button();
              control.set({
                enabled: true,
                icon: "eventrecorder.icon.edit",
                toolTipText: "Edit script"
              });
              control.addListener("execute", this.edit, this);
              this.bind("recorder.running", control, "enabled", {
                converter: function converter(v) {
                  return !v;
                }
              }); // this.bind("script", editButton, "enabled", {
              //   converter: v => Boolean(v)
              // });

              break;
            }

          /**
           * Save Button
           */

          case "save":
            {
              control = new qx.ui.form.Button();
              control.set({
                enabled: false,
                icon: "eventrecorder.icon.save",
                toolTipText: "Save script"
              });
              control.addListener("execute", this.save, this);
              this.bind("recorder.running", control, "enabled", {
                converter: function converter(v) {
                  return !v;
                }
              });
              break;
            }

          default:
            throw new Error("Control '".concat(id, " does not exist.'"));
        } // add to widget and assign object id


        this.add(control);
        this.addOwnedQxObject(control, id);
        return control;
      },

      /**
       * Returns a map with object providing persistence
       * @return {{env: qx.core.Environment, storage: qx.bom.storage.Web, uri_params: {}}}
       * @private
       */
      _getPersistenceProviders: function _getPersistenceProviders() {
        return {
          env: qx.core.Environment,
          storage: qx.bom.storage.Web.getSession(),
          uri_params: qx.util.Uri.parseUri(window.location.href)
        };
      },

      /**
       * Deferred initialization of properties that get their values from the environment
       * @private
       * @ignore(env)
       * @ignore(storage)
       * @ignore(uri_params)
       */
      _iniPropertiesFromEnvironment: function _iniPropertiesFromEnvironment() {
        var _this$_getPersistence2 = this._getPersistenceProviders(),
            env = _this$_getPersistence2.env,
            storage = _this$_getPersistence2.storage,
            uri_params = _this$_getPersistence2.uri_params;

        var script = storage.getItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.SCRIPT) || "";
        this.initScript(script);
        var autoplay = uri_params.queryKey.eventrecorder_autoplay || storage.getItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.AUTOPLAY) || env.get(cboulanger.eventrecorder.UiController.CONFIG_KEY.AUTOPLAY) || false;
        this.initAutoplay(autoplay);
        var reloadBeforeReplay = storage.getItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.RELOAD_BEFORE_REPLAY);
        this.initReloadBeforeReplay(reloadBeforeReplay === null ? false : reloadBeforeReplay);
        var gistId = uri_params.queryKey.eventrecorder_gist_id || env.get(cboulanger.eventrecorder.UiController.CONFIG_KEY.GIST_ID) || null;
        this.initGistId(gistId);
        var scriptable = Boolean(uri_params.queryKey.eventrecorder_scriptable) || qx.core.Environment.get(cboulanger.eventrecorder.UiController.CONFIG_KEY.SCRIPTABLE) || false;
        this.initScriptable(scriptable); //console.warn({script, autoplay, gistId, reloadBeforeReplay, scriptable});
      },
      _applyMode: function _applyMode(value, old) {
        if (value === "player" && !this.getPlayer()) {
          throw new Error("Cannot switch to player mode: no player has been set");
        }
      },

      /**
       * When setting the script property, store it in the browser
       * @param value
       * @param old
       * @private
       */
      _applyScript: function _applyScript(value, old) {
        qx.bom.storage.Web.getSession().setItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.SCRIPT, value);

        if (this.getRecorder()) {
          this.getRecorder().setScript(value);
        }
      },
      _saveScriptUrl: function _saveScriptUrl() {
        qx.bom.storage.Web.getSession().setItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.SCRIPT_URL, document.location.href);
      },
      _scriptUrlMatches: function _scriptUrlMatches() {
        return qx.bom.storage.Web.getSession().getItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.SCRIPT_URL) === document.location.href;
      },
      _applyGistId: function _applyGistId(value, old) {// todo: add to URI
      },

      /**
       * Apply the "autoplay" property and store it in local storage
       * @param value
       * @param old
       * @private
       */
      _applyAutoplay: function _applyAutoplay(value, old) {
        qx.bom.storage.Web.getSession().setItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.AUTOPLAY, value);
      },

      /**
       * Apply the "reloadBeforeReplay" property and storeit in local storage
       * @param value
       * @param old
       * @private
       */
      _applyReloadBeforeReplay: function _applyReloadBeforeReplay(value, old) {
        qx.bom.storage.Web.getSession().setItem(cboulanger.eventrecorder.UiController.CONFIG_KEY.RELOAD_BEFORE_REPLAY, value);
      },

      /**
       * Event handler for record toggle button
       * @param e
       */
      _toggleRecord: function _toggleRecord(e) {
        if (e.getData()) {
          this.record();
        }
      },

      /**
       * Event handler for replay button
       * @private
       */
      _startReplay: function _startReplay() {
        // start
        if (this.getScript() || this.getGistId()) {
          if (this.getReloadBeforeReplay()) {
            // reload
            this.setAutoplay(true);
            window.location.reload();
          } else if (this.getScript()) {
            this.replay();
          } else {
            this.getQxObject("replay").setValue(false);
          }
        }
      },

      /**
       * Uploads content to the browser. Returns the content of the file.
       * @return {Promise<String>}
       * @private
       */
      _upload: function () {
        var _upload2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3() {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", new Promise(function (resolve, reject) {
                    var input = document.getElementById(cboulanger.eventrecorder.UiController.FILE_INPUT_ID);
                    input.addEventListener("change", function (e) {
                      var file = e.target.files[0];

                      if (!file.name.endsWith(".eventrecorder")) {
                        reject(new Error("Not an eventrecorder script"));
                      }

                      var reader = new FileReader();
                      reader.addEventListener("loadend", function () {
                        resolve(reader.result);
                      });
                      reader.addEventListener("error", reject);
                      reader.readAsText(file);
                    });
                    input.click();
                  }));

                case 1:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function _upload() {
          return _upload2.apply(this, arguments);
        }

        return _upload;
      }(),

      /**
       * Donwload content
       * @param filename
       * @param text
       * @private
       */
      _download: function _download(filename, text) {
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },

      /**
       * Get the content of a gist by its id
       * @param gist_id {String}
       * @return {Promise<*>}
       * @private
       */
      _getRawGist: function () {
        var _getRawGist2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4(gist_id) {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  return _context4.abrupt("return", new Promise(function (resolve, reject) {
                    var url = "https://api.github.com/gists/".concat(gist_id);
                    var req = new qx.io.request.Jsonp(url);
                    req.addListener("success", function (e) {
                      var response = req.getResponse();

                      if (!qx.lang.Type.isObject(response.data.files)) {
                        reject(new Error("Unexpected response: " + JSON.stringify(response)));
                      }

                      var filenames = Object.getOwnPropertyNames(response.data.files);
                      var file = response.data.files[filenames[0]];

                      if (!file.filename.endsWith(".eventrecorder")) {
                        reject(new Error("Gist is not an eventrecorder script"));
                      }

                      var script = file.content;
                      resolve(script);
                    });
                    req.addListener("statusError", function (e) {
                      return reject(new Error(e.getData()));
                    });
                    req.send();
                  }));

                case 1:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function _getRawGist(_x) {
          return _getRawGist2.apply(this, arguments);
        }

        return _getRawGist;
      }(),

      /**
       * Returns the name of the application by using the parent directory of the
       * index.html script
       * @return {string}
       * @private
       */
      _getApplicationName: function _getApplicationName() {
        return window.document.location.pathname.split("/").slice(-2, -1).join("");
      },

      /**
       * Sets up an editor in the given window
       * @param win {qx.ui.window.Window}
       * @private
       */
      __setupEditor: function __setupEditor(win) {
        var _this3 = this;

        qookery.contexts.Qookery.loadResource(qx.util.ResourceManager.getInstance().toUri("cboulanger/eventrecorder/forms/editor.xml"), this, function (xmlSource) {
          var xmlDocument = qx.xml.Document.fromString(xmlSource);
          var parser = qookery.Qookery.createFormParser();
          var formComponent = parser.parseXmlDocument(xmlDocument);
          formComponent.setQxObjectId("editor");

          _this3.addOwnedQxObject(formComponent);

          var editorWidget = formComponent.getMainWidget();
          win.add(editorWidget);
          win.setQxObjectId("window");
          formComponent.addOwnedQxObject(win);
          editorWidget.addListener("appear", function () {
            return formComponent.getModel().setLeftEditorContent(_this3.getScript());
          });

          _this3.bind("script", formComponent.getModel(), "leftEditorContent");

          var formModel = formComponent.getModel();
          formModel.bind("leftEditorContent", _this3, "script");
          formModel.addListener("changeTargetScriptType", function (e) {
            return _this3.translateTo(formModel.getTargetScriptType(), formModel.getTargetMode());
          });
          formModel.addListener("changeTargetMode", function (e) {
            return _this3.translateTo(formModel.getTargetScriptType(), formModel.getTargetMode());
          });
          qx.event.Timer.once(function () {
            return _this3.__setupAutocomplete();
          }, _this3, 1000);
          parser.dispose();

          _this3.edit();
        });
      },

      /**
       * Configures the autocomplete feature in the editor(s)
       * @private
       */
      __setupAutocomplete: function __setupAutocomplete() {
        var langTools = ace.require("ace/ext/language_tools");

        var tokens = [];
        var iface = qx.Interface.getByName("cboulanger.eventrecorder.IPlayer").$$members;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.getOwnPropertyNames(iface)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            if (key.startsWith("cmd_") && typeof iface[key] == "function") {
              var code = iface[key].toString();
              var params = code.slice(code.indexOf("(") + 1, code.indexOf(")")).split(/,/).map(function (p) {
                return p.trim();
              });
              var caption = key.substr(4).replace(/_/g, "-");
              var snippet = caption + " " + params.map(function (p, i) {
                return "${".concat(i + 1, ":").concat(p, "}");
              }).join(" ") + "\$0";
              var meta = params.join(" ");
              var value = null;
              tokens.push({
                caption: caption,
                type: "command",
                snippet: snippet,
                meta: meta,
                value: value
              });
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var ids = [];

        var traverseObjectTree = function traverseObjectTree(obj) {
          if (typeof obj.getQxObjectId !== "function") {
            return;
          }

          var id = obj.getQxObjectId();

          if (id) {
            ids.push(qx.core.Id.getAbsoluteIdOf(obj));
          }

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = obj.getOwnedQxObjects()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var owned = _step3.value;
              traverseObjectTree(owned);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        };

        var registeredObjects = Object.values(qx.core.Id.getInstance().__registeredObjects); //FIXME

        for (var _i2 = 0, _registeredObjects = registeredObjects; _i2 < _registeredObjects.length; _i2++) {
          var obj = _registeredObjects[_i2];
          traverseObjectTree(obj);
        }

        for (var _i3 = 0, _ids = ids; _i3 < _ids.length; _i3++) {
          var id = _ids[_i3];
          tokens.push({
            caption: id,
            type: "id",
            value: id
          });
        }

        var player = this.getPlayer();
        var completer = {
          getCompletions: function getCompletions(editor, session, pos, prefix, callback) {
            if (prefix.length === 0) {
              callback(null, []);
              return;
            }

            var line = editor.session.getLine(pos.row).substr(0, pos.column);

            var numberOfTokens = player._tokenize(line).length;

            var options = tokens // filter on positional argument
            .filter(function (token) {
              return token.type === "command" && numberOfTokens === 1 || token.type === "id" && numberOfTokens === 2;
            }) // filter on word match
            .filter(function (token) {
              return token.caption.toLocaleLowerCase().substr(0, prefix.length) === prefix.toLocaleLowerCase();
            }) // create popup data
            .map(function (token) {
              token.score = 100 - (token.caption.length - prefix.length);
              return token;
            });
            callback(null, options);
          }
        };
        langTools.addCompleter(completer);
      },

      /*
       ===========================================================================
         PUBLIC API
       ===========================================================================
       */

      /**
       * Returns a player instance. Caches the result
       * @param type
       * @private
       * @return {cboulanger.eventrecorder.IPlayer}
       */
      getPlayerByType: function getPlayerByType(type) {
        if (!type) {
          throw new Error("No player type given!");
        }

        if (this.__players[type]) {
          return this.__players[type];
        }

        var clazz = cboulanger.eventrecorder.player[qx.lang.String.firstUp(type)];

        if (!clazz) {
          throw new Error("A player of type '".concat(type, "' does not exist."));
        }

        var player = new clazz();
        this.__players[type] = player;
        return player;
      },

      /**
       * Starts recording
       */
      record: function () {
        var _record = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee5() {
          var recorder, mode;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  recorder = this.getRecorder();

                  if (!(this.getScript().trim() !== "" && !this.getScriptable())) {
                    _context5.next = 9;
                    break;
                  }

                  _context5.next = 4;
                  return dialog.Dialog.select("Do you want to overwrite your script or append new events?", [{
                    label: "Append",
                    value: "append"
                  }, {
                    label: "Overwrite",
                    value: "overwrite"
                  }]).promise();

                case 4:
                  mode = _context5.sent;

                  if (mode) {
                    _context5.next = 8;
                    break;
                  }

                  this.getQxObject("record").setValue(false);
                  return _context5.abrupt("return");

                case 8:
                  recorder.setMode(mode);

                case 9:
                  recorder.start();

                case 10:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function record() {
          return _record.apply(this, arguments);
        }

        return record;
      }(),

      /**
       * Stops recording/replaying
       */
      stop: function stop() {
        if (this.getRecorder().isRunning()) {
          this.getRecorder().stop();
          var script = this.getRecorder().getScript();

          this._saveScriptUrl();

          this.setScript(script);
        }

        if (this.getPlayer() && this.getPlayer().isRunning()) {
          this.getPlayer().stop();
        }
      },

      /**
       * Replays the current script
       * @return {Promise<void>}
       */
      replay: function () {
        var _replay = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee6() {
          var player, infoPane, error;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (this.getScript()) {
                    _context6.next = 2;
                    break;
                  }

                  throw new Error("No script to replay");

                case 2:
                  player = this.getPlayer();

                  if (player) {
                    _context6.next = 5;
                    break;
                  }

                  throw new Error("No player has been set");

                case 5:
                  this.setMode("player");
                  infoPane = cboulanger.eventrecorder.InfoPane.getInstance();
                  infoPane.useIcon("waiting");

                  if (qx.core.Environment.get("eventrecorder.show_progress")) {
                    player.addListener("progress", function (e) {
                      var _e$getData = e.getData(),
                          _e$getData2 = _slicedToArray(_e$getData, 2),
                          step = _e$getData2[0],
                          steps = _e$getData2[1];

                      infoPane.display("Replaying ... (".concat(step, "/").concat(steps, ")"));
                    });
                  }

                  error = null;
                  _context6.prev = 10;
                  _context6.next = 13;
                  return player.replay(this.getScript());

                case 13:
                  _context6.next = 18;
                  break;

                case 15:
                  _context6.prev = 15;
                  _context6.t0 = _context6["catch"](10);
                  error = _context6.t0;

                case 18:
                  infoPane.hide();
                  this.setMode("recorder");

                  if (!error) {
                    _context6.next = 22;
                    break;
                  }

                  throw error;

                case 22:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this, [[10, 15]]);
        }));

        function replay() {
          return _replay.apply(this, arguments);
        }

        return replay;
      }(),

      /**
       * Edits the current script
       */
      edit: function edit() {
        if (this.__editorWindow) {
          this.__editorWindow.open();

          return;
        }

        var win = new qx.ui.window.Window("Edit script");
        win.set({
          layout: new qx.ui.layout.VBox(5),
          showMinimize: false,
          width: 800,
          height: 600
        });
        win.addListener("appear", function () {
          win.center();
        });
        this.__editorWindow = win;

        this.__setupEditor(win);
      },

      /**
       * Save the current script to the local machine
       */
      save: function save() {
        var _this4 = this;

        qx.event.Timer.once(function () {
          var filename = _this4._getApplicationName() + ".eventrecorder";

          _this4._download(filename, _this4.getScript());
        }, null, 0);
      },

      /**
       * Translates the text in the left editor into the language produced by the
       * given player type. Alerts any errors that occur.
       * @param playerType {String}
       * @param mode {String}
       * @return {String|false}
       */
      translateTo: function translateTo(playerType, mode) {
        var exporter = this.getPlayerByType(playerType);
        var model = this.getQxObject("editor").getModel();

        if (mode) {
          exporter.setMode(mode);
        }

        var editedScript = model.getLeftEditorContent();

        try {
          var translatedText = exporter.translate(editedScript);
          model.setRightEditorContent(translatedText);
          return translatedText;
        } catch (e) {
          this.error(e);
          dialog.Dialog.error(e.message);
        }

        return false;
      },

      /**
       * Export the script in the given format
       * @param playerType {String}
       * @param mode {String}
       * @return {Boolean}
       */
      exportTo: function exportTo(playerType, mode) {
        var _this5 = this;

        var exporter = this.getPlayerByType(playerType);

        if (mode) {
          exporter.setMode(mode);
        }

        var translatedScript = this.getQxObject("editor").getModel().getRightEditorContent();

        if (!translatedScript) {
          if (!this.getScript()) {
            dialog.Dialog.error("No script to export!");
            return false;
          }

          translatedScript = this.translateTo(playerType);
        }

        qx.event.Timer.once(function () {
          var filename = _this5._getApplicationName();

          _this5._download("".concat(filename, ".").concat(exporter.getExportFileExtension()), translatedScript);
        }, null, 0);
        return true;
      },

      /**
       * Load a script from the local machine
       * @return {Promise<void>}
       */
      load: function () {
        var _load = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee7() {
          var script;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.prev = 0;
                  _context7.next = 3;
                  return this._upload();

                case 3:
                  script = _context7.sent;
                  this.setScript(script);
                  _context7.next = 10;
                  break;

                case 7:
                  _context7.prev = 7;
                  _context7.t0 = _context7["catch"](0);
                  dialog.Dialog.error(_context7.t0.message);

                case 10:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this, [[0, 7]]);
        }));

        function load() {
          return _load.apply(this, arguments);
        }

        return load;
      }(),

      /**
       * Loads a gist selected from a github user's gists
       * @return {Promise<void>}
       */
      loadUserGist: function () {
        var _loadUserGist = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee8() {
          var formData, answer, username, gist_data, suffix, options;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  formData = {
                    username: {
                      type: "Textfield",
                      label: "Username",
                      options: options
                    },
                    show_all: {
                      type: "Checkbox",
                      value: false,
                      label: "Show all scripts (even if URL does not match)"
                    }
                  };
                  _context8.next = 3;
                  return dialog.Dialog.form("Please enter the GitHub username", formData).promise();

                case 3:
                  answer = _context8.sent;

                  if (!(!answer || !answer.username.trim())) {
                    _context8.next = 6;
                    break;
                  }

                  return _context8.abrupt("return");

                case 6:
                  username = answer.username;
                  cboulanger.eventrecorder.InfoPane.getInstance().useIcon("waiting").display("Retrieving data from GitHub...");
                  _context8.next = 10;
                  return new Promise(function (resolve, reject) {
                    var url = "https://api.github.com/users/".concat(username, "/gists");
                    var req = new qx.io.request.Jsonp(url);
                    req.addListener("success", function (e) {
                      cboulanger.eventrecorder.InfoPane.getInstance().hide();
                      var response = req.getResponse();

                      if (response.data && response.message) {
                        reject(response.message);
                      } else if (response.data) {
                        resolve(response.data);
                      }

                      reject(new Error("Invalid response."));
                    });
                    req.addListener("statusError", reject);
                    req.send();
                  });

                case 10:
                  gist_data = _context8.sent;
                  suffix = ".eventrecorder";

                  if (!answer.show_all) {
                    suffix = "." + this._getApplicationName() + suffix;
                  }

                  options = gist_data.filter(function (entry) {
                    return entry.description && Object.values(entry.files).some(function (file) {
                      return file.filename.endsWith(suffix);
                    });
                  }).map(function (entry) {
                    return {
                      label: entry.description,
                      value: entry.id
                    };
                  });

                  if (!(options.length === 0)) {
                    _context8.next = 17;
                    break;
                  }

                  dialog.Dialog.error("No matching gists were found.");
                  return _context8.abrupt("return");

                case 17:
                  formData = {
                    id: {
                      type: "SelectBox",
                      label: "Script",
                      options: options
                    }
                  };
                  _context8.next = 20;
                  return dialog.Dialog.form("Please select from the following scripts:", formData).promise();

                case 20:
                  answer = _context8.sent;

                  if (!(!answer || !answer.id)) {
                    _context8.next = 23;
                    break;
                  }

                  return _context8.abrupt("return");

                case 23:
                  _context8.t0 = this;
                  _context8.next = 26;
                  return this._getRawGist(answer.id);

                case 26:
                  _context8.t1 = _context8.sent;

                  _context8.t0.setScript.call(_context8.t0, _context8.t1);

                case 28:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function loadUserGist() {
          return _loadUserGist.apply(this, arguments);
        }

        return loadUserGist;
      }(),

      /**
       * Loads a gist by its id.
       * @return {Promise<void>}
       */
      loadGistById: function () {
        var _loadGistById = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee9() {
          var answer;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return dialog.Dialog.prompt("Please enter the id of the gist to replay");

                case 2:
                  answer = _context9.sent;

                  if (!(!answer || !answer.id)) {
                    _context9.next = 5;
                    break;
                  }

                  return _context9.abrupt("return");

                case 5:
                  _context9.t0 = this;
                  _context9.next = 8;
                  return this._getRawGist(answer.id);

                case 8:
                  _context9.t1 = _context9.sent;

                  _context9.t0.setScript.call(_context9.t0, _context9.t1);

                  this.setGistId(answer.id);

                case 11:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function loadGistById() {
          return _loadGistById.apply(this, arguments);
        }

        return loadGistById;
      }()
    },

    /**
     * Will be called after class has been loaded, before application startup
     */
    defer: function defer() {
      qookery.Qookery.setOption(qookery.Qookery.OPTION_EXTERNAL_LIBRARIES, qx.util.ResourceManager.getInstance().toUri("cboulanger/eventrecorder/js")); // called when application is ready

      qx.bom.Lifecycle.onReady(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10() {
        var infoPane, dispayedText, controller;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                infoPane = cboulanger.eventrecorder.InfoPane.getInstance();
                infoPane.useIcon("waiting");
                infoPane.display("Initializing Event Recorder, please wait...");
                dispayedText = infoPane.getDisplayedText(); // assign object ids if object id generator has been included

                if (!qx.Class.isDefined("cboulanger.eventrecorder.ObjectIdGenerator")) {
                  _context10.next = 7;
                  break;
                }

                _context10.next = 7;
                return new Promise(function (resolve) {
                  var objIdGen = qx.Class.getByName("cboulanger.eventrecorder.ObjectIdGenerator").getInstance();
                  objIdGen.addListenerOnce("done", resolve);
                });

              case 7:
                // hide splash screen if it hasn't used by other code yet
                if (infoPane.getDisplayedText() === dispayedText) {
                  infoPane.hide();
                } // create controller


                controller = new cboulanger.eventrecorder.UiController();
                qx.core.Init.getApplication().getRoot().add(controller, {
                  top: 0,
                  right: 10
                });
                controller.show();

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      })));
    }
  });
  cboulanger.eventrecorder.UiController.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=UiController.js.map?dt=1556283808946