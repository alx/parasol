var debug = AFRAME.utils.debug;
var coordinates = AFRAME.utils.coordinates;

var warn = debug('components:look-at:warn');
var isCoordinate = coordinates.isCoordinates;

delete AFRAME.components['look-at'];

/**
 * Look-at component.
 *
 * Modifies rotation to either track another entity OR do a one-time turn towards a position
 * vector.
 *
 * If tracking an object via setting the component value via a selector, look-at will register
 * a behavior to the scene to update rotation on every tick.
 */
AFRAME.registerComponent('look-at', {
	schema: {
		src: {
			default: '',

			parse: function (value) {
				// A static position to look at.
				if (isCoordinate(value) || typeof value === 'object') {
					return coordinates.parse(value);
				}
				// A selector to a target entity.
				return value;
			},

			stringify: function (data) {
				if (typeof data === 'object') {
					return coordinates.stringify(data);
				}
				return data;
			},
		},
		checkSrcEveryFrame: {
			default: false,
		},
		updateWorldTransform: {
			default: false,
		}
	},

	init: function () {
		this.target3D = null;
		this.vector = new THREE.Vector3();
	},

	/**
	 * If tracking an object, this will be called on every tick.
	 * If looking at a position vector, this will only be called once (until further updates).
	 */
	update: function () {
		var self = this;
		var target = self.data.src;
		var object3D = self.el.object3D;
		var targetEl;

		// No longer looking at anything (i.e., look-at="").
		if (!target || (typeof target === 'object' && !Object.keys(target).length)) {
			return self.remove();
		}

		// Look at a position.
		if (typeof target === 'object') {
			return object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z));
		}

		return this.updateTarget(target);
	},

	updateTarget: function (target) {
		var self = this;
		var targetEl;

		// Assume target is a string.
		// Query for the element, grab its object3D, then register a behavior on the scene to
		// track the target on every tick.
		targetEl = this.el.sceneEl.querySelector(target);
		if (!targetEl) {
			warn('"' + target + '" does not point to a valid entity to look-at');
			return;
		}
		if (!targetEl.hasLoaded) {
			return targetEl.addEventListener('loaded', function () {
				self.beginTracking(targetEl);
			});
		}
		return self.beginTracking(targetEl);
	},

	tick: function (t) {
		var self = this;
		var target = self.data.target;
		var object3D = self.el.object3D;
		var targetEl;

		// Track target object position. Depends on parent object keeping 
		// global transforms up to state with updateMatrixWorld(). 
		// In practice, this is handled by the renderer, but will result in 
		// 

		if (typeof self.data.target === 'string' && self.data.checkSrcEveryFrame) {
			targetEl = self.el.sceneEl.querySelector(target);
			if (!targetEl) {
				warn('"' + target + '" does not point to a valid entity to look-at');
				this.target3D = null;
				return;
			}
			if (!targetEl.hasLoaded) {
				return targetEl.addEventListener('loaded', function () {
					self.beginTracking(targetEl);
				});
			} else {
				self.beginTracking(targetEl);
			}
		}

		if (this.target3D) {
			this.vector.setFromMatrixPosition(this.target3D.matrixWorld);
			if (object3D.parent) {
				if (this.data.updateWorldTransform) {
					object3D.parent.updateMatrixWorld();
				}
				object3D.parent.worldToLocal(this.vector);
			}
			return object3D.lookAt(this.vector);
		}
	},

	beginTracking: function (targetEl) {
		this.target3D = targetEl.object3D;
	}
});

/**
 * Billboard component.
 *
 * Modifies rotation to track the current camera, keeping the entity facing it 
 *
 */
AFRAME.registerComponent('billboard', {
	init: function () {
		this.vector = new THREE.Vector3();
	},

	tick: function (t) {
		var self = this;
		var target = self.el.sceneEl.camera;
		var object3D = self.el.object3D;

		// make sure camera is set
		if (target) {
			target.updateMatrixWorld();
			this.vector.setFromMatrixPosition(target.matrixWorld);
			if (object3D.parent) {
				object3D.parent.updateMatrixWorld();
				object3D.parent.worldToLocal(this.vector);
			}
			return object3D.lookAt(this.vector);
		}
	}
});