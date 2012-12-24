//varying mediump vec2 textureCoordinate;
//uniform sampler2D inputImageTexture;
//
//// lens
//void main(void)
//{
//    
//    lowp vec2 resolution;
//    lowp vec4 mouse;
//    
//    lowp vec2 p = gl_FragCoord.xy / resolution.xy;
//    lowp vec2 m = mouse.xy / resolution.xy;
//    mediump float lensSize = 0.4;
//
//    lowp vec2 d = p - m;
//    mediump float r = sqrt(dot(d, d)); // distance of pixel from mouse
//    
//    lowp vec2 uv;
//    if (r >= lensSize) {
//        uv = p;
//    } //else {
////        // Thanks to Paul Bourke for these formulas; see
////        // http://paulbourke.net/miscellaneous/lenscorrection/
////        // and .../lenscorrection/lens.c
////        // Choose one formula to uncomment:
////        // SQUAREXY:
////        // uv = m + vec2(d.x * abs(d.x), d.y * abs(d.y));
////        // SQUARER:
////        uv = m + d * r; // a.k.a. m + normalize(d) * r * r
////        // SINER:
////        // uv = m + normalize(d) * sin(r * 3.14159 * 0.5);
////        // ASINR:
////        // uv = m + normalize(d) * asin(r) / (3.14159 * 0.5);
////    }
////    
////    vec3 col = texture2D(tex0, vec2(uv.x, -uv.y)).xyz;
//    
//    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//}





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

    //original reference
//    lowp vec3 tc = vec3(1.0, 0.0, 0.0);
//    
//    lowp vec3 pixcol = texture2D(inputImageTexture, textureCoordinate).rgb;
//    lowp vec3 colors[3];
//    colors[0] = vec3(0.0, 0.0, 1.0);
//    colors[1] = vec3(1.0, 1.0, 0.0);
//    colors[2] = vec3(1.0, 0.0, 0.0);
//    mediump float lum = (pixcol.r + pixcol.g + pixcol.b) / 3.0;
//    int ix = (lum < 0.5)? 0:1;
//    tc = mix(colors[ix], colors[ix + 1], (lum - float(ix) * 0.5) / 0.5);
//    
//    gl_FragColor = vec4(tc, 1.0);
}

