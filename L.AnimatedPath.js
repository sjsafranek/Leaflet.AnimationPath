

// change smooth factor for length of latlngs
// getLatLngs()

L.AnimatedPath = L.Polyline.extend({
	
	options: {
		color: '#fff',
		weight: 1,
		opacity: 0.5,
		smoothFactor: 5,
		animationSpeed: 5000,
		maxPathLength: 250		// removes old latlng values
	},
	
	initialize: function (latlngs, options) {
        L.Util.setOptions(this, {});
		L.Polyline.prototype.initialize.call(this, latlngs, options);
	},
	
	setAnimationSpeed: function(milliseconds) {
		this.options.animationSpeed = milliseconds;
	},
	
	getAnimationSpeed: function() {
		return this.options.animationSpeed;
	},
	
	getMaxPathLength: function() {
		return this.options.maxPathLength;
	},
	
	addLocation: function(newlatlng) {
		
		try {
			var latlngs = this.getLatLngs();
			var oldlatlng = latlngs[latlngs.length-1];
			
			var generator = new arc.GreatCircle(
				{x: oldlatlng.lng, y: oldlatlng.lat},
				{x: newlatlng.lng, y: newlatlng.lat}
			);
			var line = generator.Arc(100, { offset: 10 });
			
			newlatlngs = line.geometries[0].coords.map(function(c) {
				return c.reverse();
			});
			
			for (var i in newlatlngs) {
				this.addLatLng( new L.LatLng(newlatlngs[i][1], newlatlngs[i][0]) );
			}
		}
		
		catch(err) {
			this.addLatLng( newlatlng );
		}
		
		this.clipLatLngs();
	},
	
	clipLatLngs: function() {
		var latlngs = this.getLatLngs();
		var maxPathLength = this.getMaxPathLength();
		while (latlngs.length > maxPathLength) {
			latlngs.shift();
		}
		this.setLatLngs(latlngs);
	},
	
	animate: function() {
		var self = this;
		
		var ms = this.getAnimationSpeed();
		
		this._path.style.transition = "";
		
		var totalLength = this._path.getTotalLength();
		this._path.style.strokeDashoffset = totalLength;
		this._path.style.strokeDasharray = totalLength/100;

		this._path.style.transition = "stroke-dashoffset "+ms+"ms linear";
		
		// Offset the timeout here: setTimeout makes a function
		// run after a certain number of milliseconds - in this
		// case we want each flight path to be staggered a bit.
		setTimeout((function(path) {
			return function() {
				// setting the strokeDashoffset to 0 triggers
				// the animation.
				path.style.strokeDashoffset = 0;
				self.animate();
			};
		})(this._path), ms);
				
	},

});


