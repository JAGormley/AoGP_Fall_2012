varying highp vec2 textureCoordinate;
uniform sampler2D inputImageTexture;


void main()
{
    mediump float width = 640.0;
    mediump float height = 480.0;
    
    mediump float w = 1.0/width;
    mediump float h = 1.0/height;
    
    highp vec2 texCoord  = textureCoordinate;
    
    lowp vec4 n[9];
    n[0] = texture2D(inputImageTexture, texCoord + highp vec2( -w, -h));
    n[1] = texture2D(inputImageTexture, texCoord + highp vec2(0.0, -h));
    n[2] = texture2D(inputImageTexture, texCoord + highp vec2(  w, -h));
    n[3] = texture2D(inputImageTexture, texCoord + highp vec2( -w, 0.0));
    n[4] = texture2D(inputImageTexture, texCoord);
    n[5] = texture2D(inputImageTexture, texCoord + highp vec2(  w, 0.0));
    n[6] = texture2D(inputImageTexture, texCoord + highp vec2( -w, h));
    n[7] = texture2D(inputImageTexture, texCoord + highp vec2(0.0, h));
    n[8] = texture2D(inputImageTexture, texCoord + highp vec2(  w, h));
    
    
    //SOBEL EDGE
    lowp vec4 sobel_horizEdge = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);
    lowp vec4 sobel_vertEdge  = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);
    lowp vec3 sobel = sqrt((sobel_horizEdge.rgb * sobel_horizEdge.rgb) + (sobel_vertEdge.rgb * sobel_vertEdge.rgb));
    
    gl_FragColor = vec4( sobel, 1.0 );
}

