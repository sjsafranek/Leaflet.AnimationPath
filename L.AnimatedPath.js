

L.AnimatedPath = L.Polyline.extend({
	
	options: {
		//color: '#fff',
		color: '#000',
		//weight: 1,
		weight: 2.5,
		opacity: 0.5,
		smoothFactor: 1,
		dashArray: "5, 7",
		//animationSpeed: 10000,
		maxPathLength: 300		// removes old latlng values
	},
	
	initialize: function (latlngs, options) {
        L.Util.setOptions(this, {});
		L.Polyline.prototype.initialize.call(this, latlngs, options);
	},
/*	
	setAnimationSpeed: function(milliseconds) {
		this.options.animationSpeed = milliseconds;
	},
	
	getAnimationSpeed: function() {
		return this.options.animationSpeed;
	},
*/		
	getMaxPathLength: function() {
		return this.options.maxPathLength;
	},

	addTo: function(map) {
		L.Polyline.prototype.addTo.call(this, map);
		
		// Start css animations
		this._path.classList.add("animated-path");
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
		this._updateSmoothFactor()
	},
	
	clipLatLngs: function() {
		var latlngs = this.getLatLngs();
		var maxPathLength = this.getMaxPathLength();
		while (latlngs.length > maxPathLength) {
			latlngs.shift();
		}
		this.setLatLngs(latlngs);
	},
	
	// change smooth factor based on length of latlngs
	_updateSmoothFactor: function() {
		var smoothFactor = 1;
		var length = this.getLatLngs().length;
	/*
		switch(length) {
			case length < 250:
				smoothFactor = 1;
				break;
			case length < 500:
				smoothFactor = 2;
				break;
			case length < 1000:
				smoothFactor = 5;
				break;
			case length < 5000:
				smoothFactor = 10;
				break;
			default:
				smoothFactor = 15;
		}
	*/
		this.options.smoothFactor = smoothFactor;
	}
	
/*
	animate: function() {
		var self = this;
		
		this._path.classList.add("animated-path");

	
		// Get animation speed.
		var ms = this.getAnimationSpeed();
		
		// Reset transition to animate in the correct direction
		// of the LineString feature.
		this._path.style.transition = "";
		
		// Get length of svg path.
		var totalLength = this._path.getTotalLength();
		//this._path.style.strokeDashoffset = totalLength;
		this._path.style.strokeDashoffset = 0;
		//this._path.style.strokeDasharray = totalLength/100;

		// Set transition for animation.
		this._path.style.transition = "stroke-dashoffset "+ms+"ms linear";
		
		// Offset the timeout here: setTimeout makes a function
		// run after a certain number of milliseconds - in this
		// case we want each flight path to be staggered a bit.
		setTimeout((function(path) {
			return function() {
				// setting the strokeDashoffset to 0 triggers
				// the animation.
				//path.style.strokeDashoffset = 0;
				path.style.strokeDashoffset = totalLength;
				self.animate();
			};
		})(this._path), ms);	
	}
*/

});
