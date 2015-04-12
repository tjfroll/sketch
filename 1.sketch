float x, y, freq, amp, ii, turn, red;
boolean iii;
boolean rrT;

float L;
 
void setup()
{
 size(900, 980);
 background(0);
  
 x = 0;
 y = 0;
 ii = 0;
 turn = 0;
 red = 0;
 iii = false;
 rrT = false;
 freq = .02;
 amp = 50;
  
 //noLoop();
}
 
void draw()
{
  freq = .02 * mouseX / 1000;
  L = (0.2 + (mouseY / 1080))*400;
  noStroke();
  fill(0, 50);
  rect(0,0, width, height);
   
  //stroke(0, 190, 255);
  noFill();
   
  //draw shit
  if(iii == true){
    ii = ii - .01;
  }else{
    ii = ii + .01;
  }
   
  if(ii == 1){
    iii = true;
  }
  if(ii == 0){
    iii = false;
  }
   
   
  if (rrT == false){
    red = red + 1;
  }else{
    red = red - 1;
  }
  if (red == 255){
    rrT = true;
  }
  if (red == 0){
    rrT = false;
  }
   
     
  turn = turn + 1;
   
  for(int d = 0; d < 360; d++)
  {
    //float s = d/360;
    make_line(d, ii, turn, red);
     
  }
   
   
}
 
void make_line(float d, float s, float t, float r)
{
  pushMatrix();
  translate(width/2, height/2);
  rotate(radians(d + (t * .1)));
   
    beginShape();
   
    for(int i = 0; i < 150; i++)
    {
      
      stroke(r, (40+i), (255 - i), i);
       
      x = i*L;
      y = noise(x * freq, d, s ) * amp;
      vertex(x, y);
     
    }
    endShape();
    popMatrix();
}
