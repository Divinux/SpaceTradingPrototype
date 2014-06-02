var vBg : Texture2D;
var stringToEdit : String;

var vSecAmount : int = 5;
var vPlanetAmount : int = 5;
//gui style
var vGUI : GUISkin;
var vClick : AudioSource;
function OnGUI () 
{
//GUI.skin = vGUI;
	GUI.Label(Rect(-1,-1,1024,768), vBg);
	
	//back
	if(GUI.Button(Rect(410,670,100,30),"", "label"))
	{
		vClick.Play();
		Application.LoadLevel ("Main");
	}
	
	//start
	if(GUI.Button(Rect(410,610,200,30),"", "label"))
	{
		vClick.Play();
		PlayerPrefs.SetInt("loading", 0);
		PlayerPrefs.Save();
		Begin();
	}
	
	GUI.Label(Rect(20,30,300,20), "Player Name: ");
	 stringToEdit = GUI.TextField (Rect (120, 30, 200, 20), stringToEdit, 25);
	 //sector amount
	 GUI.Label(Rect(20,60,300,20), "Sectors: ");
	 GUI.Label(Rect(120,60,300,20), "" + vSecAmount);
	 if(GUI.Button(Rect(170,58,70,24),"Decrease"))
	{
		vClick.Play();
		vSecAmount--;
		if(vSecAmount < 1)
		{
			vSecAmount = 1;
		}
	}
	if(GUI.Button(Rect(250,58,70,24),"Increase"))
	{
		vClick.Play();
		vSecAmount++;
	}
	//planet amount
	GUI.Label(Rect(20,90,300,20), "Planets: ");
	 GUI.Label(Rect(120,90,300,20), "" + vPlanetAmount);
	 if(GUI.Button(Rect(170,88,70,24),"Decrease"))
	{
		vClick.Play();
		vPlanetAmount--;
		if(vPlanetAmount < 1)
		{
			vPlanetAmount = 1;
		}
	}
	if(GUI.Button(Rect(250,88,70,24),"Increase"))
	{
		vClick.Play();
		vPlanetAmount++;
	}
}

function Begin()
{
	PlayerPrefs.SetString("Name", stringToEdit);
	PlayerPrefs.SetInt("SectorAmount", vSecAmount);
	PlayerPrefs.SetInt("PlanetAmount", vPlanetAmount);
	PlayerPrefs.Save();
	Application.LoadLevel ("Universe");
}

function Start()
{
if(PlayerPrefs.GetInt("mute") == 1)
		{

			AudioListener.pause = true;
		}
		else
		{

			AudioListener.pause = false;
		}
}

function Update()
{
//muting function
if(Input.GetKeyDown("m"))
	{
		if(PlayerPrefs.GetInt("mute") != 1)
		{
			PlayerPrefs.SetInt("mute", 1);
			AudioListener.pause = true;
		}
		else
		{
			PlayerPrefs.SetInt("mute", 0);
			AudioListener.pause = false;
		}
		PlayerPrefs.Save();
	}
	
	}
