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
      "qookery.IResourceLoader": {
        "require": true
      },
      "qx.util.ResourceManager": {},
      "qx.bom.request.Xhr": {},
      "qx.util.Request": {},
      "qx.log.Logger": {},
      "qx.lang.String": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("qookery.impl.DefaultResourceLoader", {
    type: "singleton",
    extend: qx.core.Object,
    implement: [qookery.IResourceLoader],
    members: {
      resolveResourceUri: function resolveResourceUri(name) {
        if (name.charAt(0) === "/") return name; // Input argument is an absolute path

        return qx.util.ResourceManager.getInstance().toUri(name);
      },
      loadResource: function loadResource(name, thisArg, successCallback, failCallback) {
        var asynchronous = true;

        if (!successCallback) {
          successCallback = this._defaultSuccessCallback;
          asynchronous = false;
        }

        if (!failCallback) {
          failCallback = this._defaultFailCallback;
        }

        var result;
        var resourceUri = this.resolveResourceUri(name);
        var xhrRequest = new qx.bom.request.Xhr();

        xhrRequest.onerror = xhrRequest.ontimeout = function () {
          result = failCallback.call(thisArg, xhrRequest, name);
        };

        xhrRequest.onload = function () {
          var statusCode = xhrRequest.status;
          var wasSuccessful = qx.util.Request.isSuccessful(statusCode);
          if (wasSuccessful) result = successCallback.call(thisArg, xhrRequest.responseText, name);else result = failCallback.call(thisArg, xhrRequest, name);
        };

        try {
          xhrRequest.open("GET", resourceUri, asynchronous); // When debugging, disable browser cache

          xhrRequest.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
          xhrRequest.send();
          return result;
        } catch (e) {
          qx.log.Logger.error(this, "I/O error loading resource", name, e);
          result = failCallback.call(thisArg, xhrRequest, name);
        }

        return result;
      },
      _defaultFailCallback: function _defaultFailCallback(xhrRequest, name) {
        throw new Error(qx.lang.String.format("Error %1 loading resource '%2': %3", [xhrRequest.status, name, xhrRequest.statusText]));
      },
      _defaultSuccessCallback: function _defaultSuccessCallback(responseText, name) {
        return responseText;
      }
    }
  });
  qookery.impl.DefaultResourceLoader.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=DefaultResourceLoader.js.map?dt=1556283809380