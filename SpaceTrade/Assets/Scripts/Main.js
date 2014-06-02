var vBg : Texture2D;
var vClick : AudioSource;

function OnGUI () 
{
	GUI.Label(Rect(-1,-1,1024,768), vBg);
	//start new
	if(GUI.Button(Rect(410,275,200,30),"", "label"))
	{
		vClick.Play();
		PlayerPrefs.SetInt("loading", 0);
		PlayerPrefs.Save();
		Application.LoadLevel ("Creation");
	}
	//load game
	if(GUI.Button(Rect(410,335,200,30),"", "label"))
	{
		vClick.Play();
		PlayerPrefs.SetInt("loading", 1);
		PlayerPrefs.Save();
		Application.LoadLevel ("Universe");
	}
	//options
	if(GUI.Button(Rect(410,390,200,30),"", "label"))
	{
		vClick.Play();
		Application.LoadLevel ("Help");
	}
	//quit
	if(GUI.Button(Rect(410,455,200,30),"", "label"))
	{
		vClick.Play();
		print("Application terminated");
		Application.Quit();
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