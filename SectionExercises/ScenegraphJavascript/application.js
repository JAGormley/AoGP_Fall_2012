$( document ).ready( function(){
	// var extend = function(inherit, base){
	// 	for (var prop in base){
	// 		inherit[prop] = base[prop];
	// 	}
	// }
	// extend(NodeGeom,NodeBase);

	$.extend(NodeGeom, NodeBase);


	var root = Object.create( NodeGeom )
	root.setName( "root" )
	root.setColor("0xFF0000")
	root.setType(0)

	var childA = Object.create( NodeGeom )
	childA.setName("childA")
	childA.setColor("0x000000")
	childA.setType(1)
	root.addChild(childA)


	setInterval(function(){
		console.log("----------------")
		root.print( 0 )

		if(childA != null){
			childA.toggleVisibility()
		}
	}, 2000)
	


 // /	BaseClass.prototype = Object.create( NodeBase )


})




var NodeGeom = {
	mPosition : {x: 0, y: 0, z: 0},
	mRotation : {x: 0, y: 0, z: 0},
	mScale : {x: 1, y: 1, z: 1},
	mColor : "0xFFFFFF",
	mType : 0, //add method setType to determine what is being drawn

	draw : function(){
		if( getVisibility() ){

			drawGeom( mType )

			var tChildCount = getChildCount();
			for(var i = 0; i < tChildCount; i++){
				var tmpColor = getChild(i).getColor()
				var tmpType = getChild(i).getType();
				getChild(i).draw();
			}
		}
	},

	getType : function(){
		return this.mType
	},

	getPosition : function(){
		return this.mPosition
	},

	getRotation : function(){
		return this.mRotation
	},

	getScale : function(){
		return this.mScale
	},

	getColor : function(){
		return this.mColor
	},

	setType : function( iValue ){
		this.mType = iValue
	},

	setPosition : function( iValue ){
		this.mPosition.x = iValue.x
		this.mPosition.y = iValue.y
		this.mPosition.z = iValue.z
	},

	setRotation : function( iValue ){
		this.mRotation.x = iValue.x
		this.mRotation.y = iValue.y
		this.mRotation.z = iValue.z
	},

	setScale : function( iValue ){
		this.mScale.x = iValue.x
		this.mScale.y = iValue.y
		this.mScale.z = iValue.z
	},

	setColor : function( iColor ){
		this.mColor = iColor
	},

	drawGeom : function( iType ){
		if( this.mType = 0 ){
			console.log("insert draw mType 0 here")
		}
		if( this.mType = 1 ){
			console.log("insert draw mType 1 here")
		}
		if( this.mType = 2 ){
			console.log("insert draw mType 2 here")
		}
	}

}


var NodeBase = {
	mName : "untitled",
	mParent : null,
	mChildren : [],
	mVisibility : true,

	setName : function( iName ){
		this.mName = iName
	},

	getName : function(){
		return this.mName
	},

	addChild : function( iChild ){
		iChild.setParent( this )
		this.mChildren.push( iChild )
	},

	removeChild : function( iIndex ){
		if( iIndex >= 0 && iIndex < this.mChildren.length-1 ){
			this.mChildren[iIndex].setParent( null )
			this.mChildren.splice( iIndex, 1 )
		}
	},

	getChild : function( iIndex ){
		if( iIndex >= 0 && iIndex < this.mChildren.length-1 ){
			return this.mChildren[iIndex]
		}
	},

	getChildCount : function(){
		return this.mChildren.length
	},

	setParent : function( iParent ){
		this.mParent = iParent
	},

	getParent : function(){
		return this.mParent
	},

	isRootNode : function(){
		return (this.mParent == null)
	},

	getRootNode : function(){
		if( this.isRootNode() ){
			return this
		}else{
			return this.mParent.getRootNode()
		}
	},

	getVisibility : function(){
		return this.mVisibility
	},

	getParentVisibility : function(){
		if( isRootNode() ){
			return mVisibility
		}else{
			return (mParent.getVisibility() && mVisibility )
		}
	},

	setVisibility : function( iVisibility ){
		this.mVisibility = iVisibility
	},

	toggleVisibility : function(){
		this.mVisibility = !this.mVisibility
	},

	print : function( iIndent ){
		if( this.getVisibility() ){
			var indent = "  " //indentationstring
			var len = indent.length * iIndent
			var indentStr = String(len).replace("0", indent)
			console.log( indentStr + this.mName ) //node info string
			var tChildCount = this.getChildCount()
			for( var i = 0; i < tChildCount; i++ ){
				// this.mChildren[i].print( iIndent + 1 )
				if( this.mChildren[i].getParent().mName == "root" ){
					if( this.mChildren[i].getVisibility() )
						console.log( "    " +this.mChildren[i].getName() )
				}else{
					if( this.mChildren[i].getVisibility() )
						console.log( "        " +this.mChildren[i].getName() )
				}
			}
		}
	}
}

