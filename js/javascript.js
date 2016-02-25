// 10px = 1 cm;

WorldScale = 10;

Wave1Points = new Array();
Wave2Points = new Array();
PlotPoints = new Array();
Wave1Ghost = new Array();
Wave2Ghost = new Array();

/* called by onLoad */

function initialize(){
	//  Sets up the canvas for live action.

	theCanvas = document.getElementById("CanvasOne");
	ctx = theCanvas.getContext("2d");
	
	
	Grid = "off";
	Pause = "off";
	Running = "no";
	ShowGhosts = "off";
	SpeedControls = "off";
	ShowFun = "no";
	DontMove = "no";
	signchange1 = 1.0;
	signchange2 = 1.0;
	wavetype1 = 0;
	wavetype2 = 0;
	InvertStatus1 = 0;
	InvertStatus2 = 0;
	
	XType = 7;
	HighGrid = 375;
	LowGrid = 600;
	LeftGrid = 50;
	RightGrid = 900;
	YSpace = 100;
	MidX = (RightGrid-LeftGrid)/2 + LeftGrid;
	MidY = LowGrid - (LowGrid - HighGrid)/2;
	MaxY = 1.00;
	IncY = 0.2;
	
	XClamp = 860;
	YClamp = 570;
	
	AutoSlow = "off";
	
	//  YScale is Number of Pixel per meter
	YRegion = 1; // 1 space is 1 meter in distance
	
	YScale = (LowGrid - HighGrid)/YRegion;
	
	
	
	// XScale is the number of Pixels per meter in the horizontal direction
	XRegion = 10;
	
	XScale = (RightGrid-LeftGrid)/XRegion;
	
	
	Amplitude = 12;
	f = 2;
	C = 0;
	D = 0;
	NumberOfWaves = 1;
	WaveFront = 0;
	
	Amplitude2 = Amplitude;
	f2 = f;
	

	faketime = 0;
	deltatime = 0.01;
	
	xsupport1pos = 465;
	ysupport1pos = 590;
	tsupport1 = 0;
	
	LinearDensity = .1;
	
	Tension = 5
	
	CalculateParameters();
	
		
}

function CalculateParameters(){

	SpeedOfWaveFront = Math.pow((Tension/LinearDensity), 0.5);
	A = Amplitude/100;
	A2 = A;
	SpeedOfWaveFrontpxsec = SpeedOfWaveFront*XScale;
	L = SpeedOfWaveFront/f;
	L2 = L;
	drawingpart();
	

}


/* Called by the Begin Button */

function LoadIt(){
	document.getElementById("LabSection").style.visibility = "visible";
	document.getElementById("OverviewSection").style.visibility = "hidden";
	document.getElementById("ShowGrid").style.visibility = "visible";
	document.getElementById("AutoSlow").style.visibility = "visible";
	document.getElementById("GhostImage").style.visibility = "visible";
	document.getElementById("PauseTime").style.visibility = "hidden";
	document.getElementById("FitArea").style.visibility = "hidden";
	
}

function PointsForCurve(){
	if (AutoSlow == "on"){
		deltatime = 0.001;
	}
	else{
		deltatime = 0.01;
	}

	for (i = 0; i <= 930; i++){
		Wave1Points[i] = (A*YScale)*Math.sin(2*Math.PI*f*faketime - 2*Math.PI*(1/(L*XScale)*i)+C) - D*YScale;
		Wave2Points[i] = (A2*YScale)*Math.sin(2*Math.PI*f2*faketime - 2*Math.PI*(1/(L2*XScale)*(930-i))+C+Math.PI) - D*YScale;
			
		PlotPoints[i] = Wave1Points[i] + Wave2Points[i] + MidY;
		Wave1Ghost[i] = Wave1Points[i] +  MidY;
		Wave2Ghost[i] = Wave2Points[i] + MidY;
	}
}


function StartMotion(){
	SpeedControls = "on";
	Running = "yes";
	StartItMoving=setInterval(drawingpart, 20);
	document.getElementById("ControlArea").style.visibility = "hidden";
	document.getElementById("PauseTime").style.visibility = "visible";
	document.getElementById("FitArea").style.visibility = "visible";
}

function ResetSystem(){
	SpeedControls = "off";
	document.getElementById("ControlArea").style.visibility = "visible";
	//document.getElementById("ShowGrid").style.visibility = "visible";
	document.getElementById("PauseTime").style.visibility = "hidden";
	Pause = "off";
	document.getElementById("LittleStepForward").style.visibility = "hidden";
	document.getElementById("LittleStepBack").style.visibility = "hidden";
	document.getElementById("BigStepForward").style.visibility = "hidden";
	document.getElementById("BigStepBack").style.visibility = "hidden";
	document.getElementById("FitArea").style.visibility = "hidden";
	Running = "no";
	ShowFun = "no";
	faketime = 0;
	deltatime = 0.01;
	clearInterval(StartItMoving);
	drawingpart();
}

function PauseSimulation(){
	clearInterval(StartItMoving);
}

function ResumeSimulation(){
	StartItMoving = setInterval(drawingpart, 20);
}

function drawingpart(){
			
/* 	background drawing */

	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0,0,925,600);
	
	FrequencyGenerator(225,150,440,0);
	
	if (SpeedControls == "on"){
		DrawSpeedControls(675,135,15);
	}
	
	DrawStringControls();
	
	if (Grid == "on"){
		DrawGrid(0,430);
	}
	
	DrawDivider();
	
	if (ShowFun == "yes"){
		DrawSupport(StartCurve,ysupport1pos,tsupport1, 40);
		DrawSupport(EndCurve,ysupport1pos,tsupport1, 40);
	}
		
	if (Running == "yes"){
		if (DontMove == "no"){
			faketime = faketime + deltatime;
		}
		else{
			DontMove = "no";
		}
		PointsForCurve();
		DrawSineCurve(A,f,C,D, L);
	}
	else{
		DrawString();
	}
	DrawLabTable(-10, 580, 950, 20);
	
	
}

function DrawSupport(x,y,t, w){
	
	cs = w/100;
	
	//Screw Piece
	ctx.strokeStyle = "#c0c0c0";
	ctx.fillStyle = "#c0c0c0";
	ctx.lineWidth = cs*2;
	ctx.beginPath();
	ctx.moveTo(x-10*cs,y-450*cs);
	ctx.lineTo(x-10*cs,y-40*cs);
	ctx.lineTo(x+10*cs, y-40*cs);
	ctx.lineTo(x+10*cs, y-450*cs);
	ctx.lineTo(x-10*cs, y-450*cs);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	
	for (i=0;i<75;i++){
		ctx.moveTo(x-10*cs,y-430*cs+6*cs*i);
		ctx.lineTo(x+10*cs,y-430*cs+6*cs*(i-1));
	}
	ctx.stroke();
	
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#000000";
	ctx.lineWidth = cs*2;
	ctx.fillRect(x-30*cs,y-450*cs,60*cs,30*cs);

	
	
	// Black Body
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#000000";
	ctx.lineWidth = cs*2;
	ctx.beginPath();
	ctx.moveTo(x-40*cs,y);
	ctx.lineTo(x+40*cs,y);
	ctx.lineTo(x+40*cs, y-100*cs);
	ctx.lineTo(x-40*cs, y-100*cs);
	ctx.lineTo(x-40*cs, y);
	ctx.lineTo(x-40*cs,y);
	ctx.stroke();
	ctx.fill();

}

function DrawDivider(){
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 5;
	ctx.beginPath();
	
	for (i = 0; i <=30; i++){
		ctx.moveTo(i*33,300);
		ctx.lineTo(i*33+16.5,300);
	}
	ctx.stroke();
	ctx.closePath();
}

function DrawStringControls(){
	WriteText(560,25,"String Tension (N)",24,"#990000",0.5);	
	WriteText(560,100,Tension.toFixed(0),32,"#990000",0.5);
	
	WriteText(800, 25, "Linear Density (kg/m)",24,"#009900",0.5);
	WriteText(800, 100, LinearDensity.toFixed(1),32,"#009900",0.5);
	
	if (Running == "no"){
		DrawArrow(500, 50, 75, 25, "#990000", Math.PI);
		DrawArrow(620, 50, 75, 25, "#990000", 0);
		DrawArrow(740, 50, 75, 25, "#009900", Math.PI);
		DrawArrow(860, 50, 75, 25, "#009900", 0);
	}
	
	
}


function DrawSpeedControls(x,y,w){
	h = w;
	if (Pause == "off"){
		DrawPauseButton(x,y,w);
	}
	else{
		DrawPlayButton(x,y,w);
		DrawArrow(x+5*w, y-0.7*h, 4*w, 2*w, "#990000", Math.PI/2);
		DrawArrow(x-5*w, y-0.7*h, 4*w, 2*w, "#990000", 3*Math.PI/2);
		
		DrawArrow(x+10*w, y+0.2*h, 2*w, 1*w, "#990000", Math.PI/2);
		DrawArrow(x-10*w, y+0.2*h, 2*w, 1*w, "#990000", 3*Math.PI/2);
	}
	

}


function DrawPauseButton(xp,yp,wp){
	hp = 3*wp;
	ctx.fillStyle = "#990000";
	ctx.strokeStyle = "#000000";
	
	ctx.fillRect(xp-wp, yp, 0.8*wp, hp);
	ctx.fillRect(xp+0.2*wp, yp, 0.8*wp, hp);
}

function DrawPlayButton(xp,yp,wp){
	hp = 3*wp;
	ctx.fillStyle = "#990000";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(xp-wp, yp);
	ctx.lineTo(xp+wp, yp+0.5*hp);
	ctx.lineTo(xp-wp, yp+1.0*hp);
	ctx.lineTo(xp-wp, yp);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();

}

function DrawGrid(x,y){
	
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = .5;
	ctx.beginPath();
	for (i=0;i<55;i++){
		if (i%5){
			
			ctx.moveTo(x+i*17.8, y+20);
			ctx.lineTo(x+i*17.8, y+80);
		}
		else if (i%10){
			
			ctx.moveTo(x+i*17.8, y);
			ctx.lineTo(x+i*17.8, y+100);
		}
		else{
			
			ctx.moveTo(x+i*17.8, y);
			ctx.lineTo(x+i*17.8, y+100);
			WriteText(x+i*17.8,y+120,i/10,14,"#000000",0.5);
		}
		
	}
	ctx.stroke();
	WriteText(x+51*17.8,y+120,"m",14,"#000000",0.5);
}

function DrawSineCurve(A,f,C,D,L){
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#000000";
	
	if (ShowFun == "yes"){
		if (E1 == 0){
			ctx.beginPath();
			ctx.arc(StartCurve,PlotPoints[StartCurve],3,0,2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = "#000000";
			ctx.fill();
		}
		if (E1 == 1){
			ctx.beginPath();
			ctx.moveTo(StartCurve+5,PlotPoints[StartCurve]-3);
			ctx.bezierCurveTo(StartCurve+5, PlotPoints[StartCurve]+5, StartCurve-5, PlotPoints[StartCurve]+5, StartCurve-5, PlotPoints[StartCurve]-3);
			ctx.stroke();
			ctx.globalAlpha = 0.5;
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 1.0;
		}
	}
	else{
		StartCurve = 1;
		EndCurve = 930;
	}
	

	ctx.beginPath();
	ctx.moveTo(StartCurve,PlotPoints[StartCurve]);
	
	for (i = StartCurve; i <= EndCurve; i++){
		ctx.lineTo(i, PlotPoints[i]);
	
	}
	ctx.stroke();
	ctx.closePath();
	
	if (ShowFun == "yes"){
		if (E2 == 0){
			ctx.beginPath();
			ctx.arc(EndCurve,PlotPoints[EndCurve],3,0,2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = "#000000";
			ctx.fill();
		}
		if (E2 == 1){
			ctx.beginPath();
			ctx.moveTo(EndCurve-5,PlotPoints[EndCurve]-3);
			ctx.bezierCurveTo(EndCurve-5, PlotPoints[EndCurve]+5, EndCurve+5, PlotPoints[EndCurve]+5, EndCurve+5, PlotPoints[EndCurve]-3);
			ctx.stroke();
			ctx.globalAlpha = 0.5;
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 1.0;
		}
	}
	
	if (ShowGhosts == "on"){
		ctx.strokeStyle = "#009900";
		ctx.lineWidth = 5;
		ctx.beginPath();
			
		ctx.moveTo(StartCurve,Wave1Ghost[StartCurve]);
		for (i = StartCurve; i <= EndCurve; i++){
			ctx.lineTo(i, Wave1Ghost[i]);
		
		}
		
		ctx.globalAlpha = 0.2;
		ctx.stroke();
		ctx.globalAlpha = 1.0;
		ctx.closePath();
		
		ctx.strokeStyle = "#000099";
		ctx.lineWidth = 5;
		ctx.beginPath();
		
		ctx.moveTo(StartCurve,Wave2Ghost[StartCurve]);
		for (i = StartCurve; i <= EndCurve; i++){
			ctx.lineTo(i, Wave2Ghost[i]);
		
		}
		
		ctx.globalAlpha = 0.2;
		ctx.stroke();
		ctx.globalAlpha = 1.0;
		ctx.closePath();
	}
}

function DrawString(){
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(-10,MidY);
	ctx.lineTo(930, MidY);
	ctx.stroke();
	ctx.closePath();	
	
}


function FrequencyGenerator(x,y,w,a){
	
	FrequencyGeneratorScale = w/450;
	h = w/1.7;
	
	// body
	ctx.fillStyle = "#99a0a5";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 5*FrequencyGeneratorScale;
	ctx.beginPath();
	ctx.lineCap="round";
	ctx.moveTo(x-0.5*w,y-0.5*h);
	ctx.lineTo(x+0.5*w,y-0.5*h);
	ctx.lineTo(x+0.5*w,y+0.5*h);
	ctx.lineTo(x-0.5*w,y+0.5*h);
	ctx.lineTo(x-0.5*w,y-0.5*h);
	ctx.lineJoin = 'round';
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
			
	//Frequency1Controls
	
	DrawDisplay(x-0.25*w, y-0.35*h, 0.25*w, f.toFixed(1), "Hz", "Frequency");
	
	af = f/6*Math.PI*1.63+ 1/5*Math.PI;
	
	DrawKnob(x-0.25*w,y+0.25*h,0.125*w,af);

	// Amplitude1 Control
	
	DrawDisplay(x+0.15*w, y-0.35*h, 0.25*w, Amplitude.toFixed(0), "cm", "Amplitude");
		
	aa = Amplitude/12*Math.PI*1.63+ 1/5*Math.PI;
	
	DrawKnob(x+0.15*w,y+0.25*h,0.125*w,aa);
	
	
	//ConnectingWire Holes Left
	
	ctx.fillStyle = "#FF0000";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = FrequencyGeneratorScale*3;
	ctx.beginPath();
	ctx.arc(x-0.45*w, y+0.20*h, 0.03*h, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = FrequencyGeneratorScale*4;
	ctx.beginPath();
	ctx.moveTo(x-0.45*w, y+0.20*h);
	ctx.lineTo(x-1.90*w, y+0.20*h);
	ctx.stroke();
	ctx.closePath();
	WriteText(x-0.465*w, y+0.15*h, "+", 16*FrequencyGeneratorScale, "#c0c0c0", 0);
	
	
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#c0c0c0";
	ctx.lineWidth = FrequencyGeneratorScale*3;
	ctx.beginPath();
	ctx.arc(x-0.45*w, y+0.40*h, 0.03*h, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#333333";
	ctx.lineWidth = FrequencyGeneratorScale*4;
	ctx.beginPath();
	ctx.moveTo(x-0.45*w, y+0.40*h);
	ctx.lineTo(x-1.90*w, y+0.40*h);

	ctx.stroke();
	ctx.closePath();
	WriteText(x-0.46*w, y+0.35*h, "-", 20*FrequencyGeneratorScale, "#c0c0c0", 0);
	
	//Draw Power Switch
	
	if (Running == "no"){
		ctx.fillStyle = "#990000";
	}
	else{
		ctx.fillStyle = "#FF0000";
	}
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = FrequencyGeneratorScale*3;
	ctx.beginPath();
	ctx.arc(x+0.40*w, y+0.2*h, 0.1*h, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	

	WriteText(x+0.40*w, y-0.0*h, "Power", 20*FrequencyGeneratorScale, "#FFFFFF", 0.5);
}


function DrawKnob(xk,yk,wk,ak){
	
	ctx.fillStyle = "#3f403e";
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(xk, yk, wk, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#FFFFFF";
	ctx.strokeStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(xk-0.60*wk, yk+0.95*wk, 0.04*wk, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.arc(xk+0.60*wk, yk+0.95*wk, 0.04*wk, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
	
	ctx.strokeStyle = "#FFFFFF";
	ctx.save();
	ctx.translate(xk, yk);
	ctx.rotate(ak);
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(0,0.90*wk);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();

}

function DrawDisplay(xd, yd, wd, mtd, utd, ttd){
	
	// black border around display
	ctx.fillStyle = "#000000";
	ctx.fillRect(xd-0.5*wd, yd, wd, 0.5*wd);
	
	// display
	ctx.fillStyle = "#d1eadf";
	ctx.fillRect(xd-0.45*wd, yd+0.05*wd, 0.9*wd, 0.4*wd);
	
	WriteText(xd+0.20*wd,yd+0.33*wd,mtd,0.3*wd,"#000000",1.0);
	WriteText(xd+0.22*wd,yd+0.33*wd,utd,0.1*wd,"#000000",0.0);
	WriteText(xd,yd+0.75*wd,ttd,0.2*wd,"#FFFFFF",0.5);
}


function DrawArrow(x, y, h, w, c, r){
	ctx.save();
	ctx.translate(x, y+0.5*h);
	ctx.rotate(r);
	ctx.fillStyle = c;
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0,-0.5*h);
	ctx.lineTo(0+w, -0.5*h+w);
	ctx.lineTo(0+0.5*w, -0.5*h+w);
	ctx.lineTo(0+0.5*w, -0.5*h+h);
	ctx.lineTo(0-0.5*w, -0.5*h+h);
	ctx.lineTo(0-0.5*w, -0.5*h+w);
	ctx.lineTo(0-w, -0.5*h+w);
	ctx.lineTo(0,-0.5*h);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function SwitchFrequency(x){
	f = f + x;
	if (f < 1){
		f = 1;
	}
	if (f > 6){
		f = 6;
	}
	f2 = f;
	CalculateParameters();
}


function SwitchAmp(x){
	Amplitude = Amplitude + x;
	if (Amplitude < 0){
		Amplitude = 0;
	}
	if (Amplitude > 12){
		Amplitude = 12;
	}
	CalculateParameters();
	Amplitude2 = Amplitude;
}

function ChangeShowGhosts(){
	if (ShowGhosts == "on"){
		ShowGhosts = "off";
		GhostMessage = "Enable Ghosting";
	}
	else{
		ShowGhosts = "on";
		GhostMessage = "Disable Ghosting";
	}
	document.getElementById("GhostImage").innerHTML = GhostMessage;
	DontMove = "yes";
	drawingpart();
}




function ChangeAutoSlow(){
	if (AutoSlow == "on"){
		AutoSlow = "off";
		SlowMoMessage = "Enable Slo-Mo";
	}
	else{
		AutoSlow = "on";
		SlowMoMessage = "Disable Slo-Mo";
	}
	document.getElementById("AutoSlow").innerHTML = SlowMoMessage;
}

function ChangeGrid(){
	if (Grid == "on"){
		Grid = "off";
		document.getElementById("ShowGrid").innerHTML = "Activate Grid";
	}
	else{
		Grid = "on";
		document.getElementById("ShowGrid").innerHTML = "Hide Grid";
	}
	drawingpart();
}


function ChangeTension(x){
	Tension = Tension + x;
	if (Tension < 3){
		Tension = 3;
	}
	if (Tension > 10){
		Tension = 10;
	}
	CalculateParameters();
}

function ChangeLD(x){
	LinearDensity = LinearDensity + x;
	if (LinearDensity < .1){
		LinearDensity = .1;
	}
	if (LinearDensity > .9){
		LinearDensity = .9;
	}
	CalculateParameters();
}



function ChangePause(){
	if (Pause == "off"){
		Pause = "on";
		//document.getElementById("ShowGrid").style.visibility = "hidden";
		document.getElementById("LittleStepForward").style.visibility = "visible";
		document.getElementById("LittleStepBack").style.visibility = "visible";
		document.getElementById("BigStepForward").style.visibility = "visible";
		document.getElementById("BigStepBack").style.visibility = "visible";
		PauseSimulation();
	}
	else{
		Pause = "off";
		//document.getElementById("ShowGrid").style.visibility = "visible";
		document.getElementById("LittleStepForward").style.visibility = "hidden";
		document.getElementById("LittleStepBack").style.visibility = "hidden";
		document.getElementById("BigStepForward").style.visibility = "hidden";
		document.getElementById("BigStepBack").style.visibility = "hidden";
		ResumeSimulation();
	}
	drawingpart();
}

function ChangePower(){
	if (Running == "no"){
		Running = "yes";
		StartMotion();
		
	}
	else{
		Running = "no";
		ResetSystem();
	}
}

function StepSystem(x){
	deltatime = x;
	drawingpart();
	
}

function ShowSupports(x){
	ShowFun = "yes";
	TypeOfConnection = x;
	if (TypeOfConnection == 1){
		StartCurve = Math.floor(xsupport1pos);
		EndCurve = Math.floor(xsupport1pos+L*XScale/2);
		E1 = 0;
		E2 = 0;
	}
	else if (TypeOfConnection == 2){
		StartCurve = Math.floor(xsupport1pos-L*XScale/2);
		EndCurve = Math.floor(xsupport1pos+L*XScale/2);
		E1 = 0;
		E2 = 0;
	}
	else if (TypeOfConnection == 3){
		StartCurve = Math.floor(xsupport1pos);
		EndCurve = Math.floor(xsupport1pos+L*XScale/4);
		E1 = 0;
		E2 = 1;
	}
	else if (TypeOfConnection == 4){
		StartCurve = Math.floor(xsupport1pos-L*XScale/2);
		EndCurve = Math.floor(xsupport1pos+L*XScale/4);
		E1 = 0;
		E2 = 1;
	}
	else if (TypeOfConnection == 5){
		StartCurve = Math.floor(xsupport1pos-L*XScale/4);
		EndCurve = Math.floor(xsupport1pos+L*XScale/4);
		E1 = 1;
		E2 = 1;
	}
	else if (TypeOfConnection == 6){
		StartCurve = Math.floor(xsupport1pos-3*L*XScale/4);
		EndCurve = Math.floor(xsupport1pos+L*XScale/4);
		E1 = 1;
		E2 = 1;
	}
	DontMove = "yes";
	drawingpart();
}

function HideSupports(){
	ShowFun = "no";
	DontMove = "yes";
	drawingpart();
}

function WriteText(x,y,t,s,c,m){
	ctx.fillStyle = c;
	ctx.font= s + "px Arial";
	temptext = t;
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = x - m*textWidth;
	ctx.fillText(temptext,xposition, y);
}
