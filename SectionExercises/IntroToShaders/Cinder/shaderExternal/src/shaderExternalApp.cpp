#include "cinder/app/AppBasic.h"
#include "cinder/gl/gl.h"
#include "cinder/gl/GlslProg.h"
#include "cinder/gl/Texture.h"
#include "cinder/ImageIo.h"
#include "cinder/Capture.h"

using namespace ci;
using namespace ci::app;
using namespace std;

#define CAM_W  640
#define CAM_H  480


class shaderExternalFileExampleApp : public AppBasic {
public:
	void setup();
	void mouseDown( MouseEvent event );
	void update();
	void draw();
    
    Capture		 mCapture;
    
	gl::GlslProg mShader;
    gl::Texture  mTexture;
};


void shaderExternalFileExampleApp::setup(){
    // Initialize shader:
	try {
        mShader = ci::gl::GlslProg( loadAsset("shader_vert.glsl"),
                                   loadAsset("shader_frag.glsl") );
	}
    catch( gl::GlslProgCompileExc &exc ) {
		console() << "Cannot compile shader: " << exc.what() << std::endl;
		exit(1);
	}
    catch( Exception &exc ){
		console() << "Cannot load shader: " << exc.what() << std::endl;
		exit(1);
	}
    
    // Initialize camera:
    try {
		mCapture = Capture( CAM_W, CAM_H );
		mCapture.start();
	}
	catch(...) { console() << "Failed to initialize camera." << endl; }
    
    
}

void shaderExternalFileExampleApp::mouseDown( MouseEvent event ){
}

void shaderExternalFileExampleApp::update(){
    if( mCapture && mCapture.checkNewFrame() ) {
		mTexture = gl::Texture( mCapture.getSurface() );
        mTexture.setWrap(GL_CLAMP, GL_CLAMP);
		mTexture.setMinFilter(GL_NEAREST);
		mTexture.setMagFilter(GL_NEAREST);
	}
}

void shaderExternalFileExampleApp::draw(){
    
	gl::clear( Color::black() );
	
    if( mTexture ) {
        mTexture.bind( 0 );
        mShader.bind();
        mShader.uniform( "texture", 0 );
        mShader.uniform( "width", (float)CAM_W );
        mShader.uniform( "height", (float)CAM_H );
        gl::drawSolidRect( getWindowBounds() );
        mShader.unbind();
        mTexture.unbind();
    }
}


CINDER_APP_BASIC( shaderExternalFileExampleApp, RendererGl )
