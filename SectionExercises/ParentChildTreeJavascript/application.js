$( document ).ready( function(){

	var root = Object.create( NodeBase )
	root.setName( "root" )

	var childA = Object.create( NodeBase )
	childA.setName( "childA" )
	root.addChild(childA)

	var childB = Object.create( NodeBase )
	childB.setName( "childB" )
	root.addChild(childB)

	var childC = Object.create( NodeBase )
	childC.setName( "childC" )
	root.addChild(childC)

	var childCa = Object.create( NodeBase )
	childCa.setName( "childCa" )
	childC.addChild(childCa)

	setInterval(function(){
		console.log("--------------")
		root.print( 0 )

	    if(childA != null){
		      childA.toggleVisibility(); 
	    }
	},1000)
})





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
					console.log( "    " +this.mChildren[i].getName() )
				}else{
					console.log( "        " +this.mChildren[i].getName() )
				}
			}
		}
	}
}




