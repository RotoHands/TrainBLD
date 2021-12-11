# _TrainBLD_

### [TrainBLD.com](https://trainbld.com), [Video demo](https://www.youtube.com/watch?v=wQnM1zwroVU), [Post](https://www.speedsolving.com/threads/trainbld-new-web-timer-that-reconstructs-your-3bld-solves.85466/)

### A new web timer that makes Rubik's blindfolded training easier and more efficient.

The timer can connect to smart cubes and analyze a Rubiks blindfolded solve.  
This is a Proof of concept for using [this HTTP SERVER](https://github.com/RotoHands/3BLD_analyzer_HTTP_Server) (the server actually analyzes the solves).

### My main goal was to make it as easy as possible for timer developers to implement this feature.

You need just to send ONE fetch request to the server, see [this example](https://github.com/RotoHands/3BLD_analyzer_HTTP_Server/blob/master/Client_Example.html).  
If you need help to implement it on your timers feel free to contact - Rotohands@gmail.com  
If you have more ideas to improve/features feel free to suggest :)

Thanks for [CSTIMER](https://github.com/cs0x7f/cstimer/blob/fc627f0970d8982c758200430bb60d7554f984b0/src/js/bluetooth.js) for the bluetooth implementation for smart cubes and Thanks to cubing.js project :)

## Main features

- reconstruct 3bld solves : commutator seperation, move count, timer per alg, letter pair, execution time, memo time, fluidness (execution time without pauses between algs), solve description
- fully coustomizable : buffers, letter scheme
- support 3Style, M2, Old-pochmann, Orozco
- best with Rubiks-connected/Go-cube --> Gan356i (I think specific my cube has problems) --> Giiker (didn't managed to implement it good enough)
- Export stats : all solves are saved, mo3, ao5, ao12, mean all
- Execution mistake recognition
- only on Chrome (because of the support for bluetooth API)

## Example solve - smart cube (UF, UFR, Speffz)

[cubeDB](https://www.cubedb.net/?puzzle=3&title=14%2F9_35.97%25280.44%2C35.53%2529__51.51%25%0A9%2F27%2F2021%2C_01%3A35_PM&scramble=F2_L2_U_B2_U-_F2_U_L-_D-_B_R_F-_R_U-_F2_R-_B-_R_B_D-_R2_U_B_&time=35.53&alg=%2F%2Fedges%0AR-_U-_R2_S_R2_S-_U_R_%2F%2F_JA__8%2F8__1.74%0AU-_R_E-_R-_U_R_R-_R_E_R-_%2F%2F_BH__10%2F18__1.08%0AL_F_L-_E_L_F-_L-_E-_%2F%2F_PL__8%2F26__0.88%0AL_F-_E_R2_E-_R2_F_L-_%2F%2F_NU__8%2F34__1.23%0AS_L-_F-_L_S-_L-_F_L_%2F%2F_VG__8%2F42__1.89%0AU2_R-_E_R_U_R-_E-_R_U_%2F%2F_FD__9%2F51__0.75%0AL_F-_L-_S-_L_F_L-_S_%2F%2F_EB__8%2F59__1.48%0A%0A%2F%2Fcorners%0AU_R-_D_R_U-_R_D-_R-_U-_R_D_R-_U_R-_D-_R_%2F%2F_VB__16%2F75__1.39%0AF-_U_R-_D-_R_U2_R-_D_R_U_F_%2F%2F_LN__11%2F86__1.92%0AU-_R-_U-_R-_D-_R_U_R-_D_R2_U_%2F%2F_DR__11%2F97__1.52%0AR_U_R_U_R-_D2_U-_U_R_U-_R-_D2_U-_R-_%2F%2F_TX__14%2F111__2.11%0A%0A%2F%2Fparity%0AR2_D_R-_U2_R_D-_R-_U-_R-_F-_R_U_R-_U-_R-_F_R2_U-_R-_U-_%2F%2F_CB_CI__20%2F131__2.31%0A)

<details>
  <summary>unparsed</summary>

<p>
F2 L2 U B2 U' F2 U L' D' B R F' R U' F2 R' B' R B D' R2 U B  //scramble

R' U' R' R' F' B U U B' F U R U' R U' D B' U B B' B D' U R'
L F L' U D' B L' B' D U' L F' D' U F' F' D U' R R F L' B F'
D' F' D B' F L' F L U U R' U D' F U F' D U' R U L F' L' B'
F U F U' B F' U R' D R U' R D' R' U' R D R' U R' D' R F' U
R' D' R U U R' D R U F U' R' U' R' D' R U R' D R R U R U R
U R' D D U' U R U' R' D D U' R' R R D R' U U R D' R' U' R'
F' R U R' U' R' F R R U' R' U'

</p>
</details>

<details>
  <summary>parsed</summary>

<p>
14/9 35.97(0.44,35.53)  51.51%  
  
F2 L2 U B2 U' F2 U L' D' B R F' R U' F2 R' B' R B D' R2 U B //scramble

//edges  
R' U' R2 S R2 S' U R // JA 8/8 1.74  
U' R E' R' U R R' R E R' // BH 10/18 1.08  
L F L' E L F' L' E' // PL 8/26 0.88  
L F' E R2 E' R2 F L' // NU 8/34 1.23  
S L' F' L S' L' F L // VG 8/42 1.89  
U2 R' E R U R' E' R U // FD 9/51 0.75  
L F' L' S' L F L' S // EB 8/59 1.48

//corners  
U R' D R U' R D' R' U' R D R' U R' D' R // VB 16/75 1.39  
F' U R' D' R U2 R' D R U F // LN 11/86 1.92  
U' R' U' R' D' R U R' D R2 U // DR 11/97 1.52  
R U R U R' D2 U' U R U' R' D2 U' R' // TX 14/111 2.11

//parity  
R2 D R' U2 R D' R' U' R' F' R U R' U' R' F R2 U' R' U' // CB CI 20/131 2.31

</p>
</details>
