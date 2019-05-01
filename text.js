var timer;
var pause=0;




window.onload = function() {
		
	var bott = document.getElementById('butt');
	bott.addEventListener('click',function(){
		if(pause!=0){
			pause = -1*pause;
			if(pause==1)bott.value="resume"; else bott.value="pause";
		}else { 
			pause=-1; bott.value="pause"; 
			start();
		}
	});
	/* just for check dbclick performence.	
	bott.addEventListener('dblclick',function(){

	location.reload();

		});

	*/	

	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');
		
	function start() {
		var file = fileInput.files[0];//load first
		var textType = /\.(seq)$/i;//seq file
			
		fileDisplayArea.innerText = file.name;//if stoke ,show filename.
		clearInterval(timer);//stop old drow,(refresh div is better?)
		if (textType.test(file.name)) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var spli = reader.result.split(",").map(
					function(item) {
						return parseInt(item, 10);
					});;
					drower(spli);
			}

				reader.readAsText(file);	
		} else {
			fileDisplayArea.innerText = "File not supported!";
		}
	}//);

}


//------drowing------

function drower(spli){

	var canvas1 = document.getElementById("canvas_1");
	var ctx = canvas1.getContext("2d");
	ctx.clearRect(0, 0, canvas1.width, canvas1.height);


	var canvas2 = document.getElementById("canvas_2");
	var ctx2 = canvas2.getContext("2d");
	var i = 3;
	//for load new file
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
			
	var aad = spli[0];
	var multipass_nr_of_passes = spli[1];

	var interlock = spli[2];
	var e = document.getElementById("interlocksel");
	//var interlock = e.options[e.selectedIndex].value;
	
	var beamPositionX;
	var beamPositionY;
	//var beamMoveX = 40;
	//var beamMoveY = 40;
	// 高度及寬度
	var paddleHeight = 40;
	var paddleWidth = 40;

	// set alpha
	ctx2.globalAlpha = 0.0625;

	function drawbeam() {
		ctx.beginPath();
		ctx.rect(beamPositionX, beamPositionY, paddleWidth, paddleHeight);
		ctx.fillStyle = "rgb(230,230,0)";
		ctx.fill();
		ctx.closePath();

		ctx2.beginPath();
		ctx2.rect(beamPositionX, beamPositionY, paddleWidth, paddleHeight);
		ctx2.fillStyle = "rgb(10, 99, 99)";
		ctx2.fill();
		ctx2.closePath();
		
	}

	function draw() {
	    
		// 清除畫面 clearPect(左上角的X座標, 左上角的Y座標, 寬度, 高度)
		ctx.clearRect(0, 0, canvas1.width, canvas1.height);
		position_calc(spli[i]);
		drawbeam();

				//	blend(canvas_2,canvas_3);
		var str = "  Aperture to Aperture Distance:"+String(aad)+"  interlock:"+String(interlock)+"  shot:"+String(i-3);
		fileDisplayArea.innerText = str;	
	}


	function position_calc(seq){
		beamPositionX = Math.floor(seq%aad)*40/interlock;
		beamPositionY = Math.floor(seq/aad)*40/interlock;
	}
		
	timer = setInterval(
		function(){
			if(i<(aad*aad+3) && pause==-1){draw();i++;
		}else if(i == (aad*aad+3)){ 
			pause=0; 
		}else{ 
			ctx.clearRect(0, 0, canvas2.width, canvas2.height); 
		} 
		
		},
		20
	);

}















			//---------------------------------just try pic mix

function blend (cv1, cv2) {
    var c2d1 = cv1.getContext('2d');
    var c2d2 = cv2.getContext('2d');
    var imgData1 = c2d1.getImageData(0, 0, cv1.width, cv1.height);
    var data1 = imgData1.data;
    var data2 = c2d2.getImageData(0, 0, cv2.width, cv2.height).data;


    var darken = function (a, b) {
        var r = {};
        for (var i in a) {
           // r[i] = a[i] < b[i] ? a[i] : b[i]; 
		   r[i] = a[i] == b[i] ? a[i]+10 : b[i]+5;
        }
        return r;
    }

    for (var i = 0, len = data1.length; i < len; i += 4) {

     fileDisplayArea.innerText = data1[i + 3];
        var newRGB = darken(
            //{r: data1[i], g: data1[i + 1], b: data1[i + 2], a: data1[i + 3]},
           // {r: data2[i], g: data2[i + 1], b: data2[i + 2], a: data1[i + 3]}
		   {a: data1[i + 3]},
            {a: data2[i + 3]}
		   
        );

      fileDisplayArea.innerText = newRGB.a;
      //  data1[i] = newRGB.r;
      //  data1[i + 1] = newRGB.g;
      //  data1[i + 2] = newRGB.b;
		data1[i + 3] = newRGB.a;

    }

  
    c2d1.putImageData(imgData1, 0, 0);

   
    //return cv1.toDataURL('image/png');
}	


