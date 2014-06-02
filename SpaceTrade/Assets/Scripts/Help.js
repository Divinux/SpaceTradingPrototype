var vBg : Texture2D;
var vClick : AudioSource;

function OnGUI () 
{
	GUI.Label(Rect(-1,-1,1024,768), vBg);
	
	//back
	if(GUI.Button(Rect(410,670,200,30),"", "label"))
	{
		vClick.Play();
		Application.LoadLevel ("Main");
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