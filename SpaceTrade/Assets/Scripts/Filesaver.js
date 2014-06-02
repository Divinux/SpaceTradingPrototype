import System;
import System.IO;
var vUn : Component;



//var  fileName = "save.txt";
function Start()
{
vUn = gameObject.GetComponent(Universe);
}
function SaveFile(fileName : String)
{
	/*if (File.Exists(fileName)) 
	{
		Debug.Log(fileName+" already exists.");
		return;
	}*/

	var sr = File.CreateText(fileName);
	
	
	//write player data
	sr.WriteLine (vUn.vName);
	sr.WriteLine (vUn.vMoney);
	sr.WriteLine (vUn.vCurrSec);
	
	//write current ship data
	sr.WriteLine (vUn.vCS.vName);
	sr.WriteLine (vUn.vCS.vClass);
	sr.WriteLine (vUn.vCS.vSpeed);
	sr.WriteLine (vUn.vCS.vMaxFuel);
	sr.WriteLine (vUn.vCS.vFuel);
	sr.WriteLine (vUn.vCS.vFuelUse);
	sr.WriteLine (vUn.vCS.vMaxHP);
	sr.WriteLine (vUn.vCS.vHP);
	sr.WriteLine (vUn.vCS.vMaxShield);
	sr.WriteLine (vUn.vCS.vCurrShield);
	sr.WriteLine (vUn.vCS.vStorage);
	sr.WriteLine (vUn.vCS.vStorageUsed);
	
	//write current weapon data
	sr.WriteLine (vUn.vCS.vWeapon.vName);
	sr.WriteLine (vUn.vCS.vWeapon.vDmg);
	sr.WriteLine (vUn.vCS.vWeapon.vReloadtime);
	
	//write length of products
	sr.WriteLine (vUn.vSP.length);
	for(var a : cProduct in vUn.vSP)
	{
		sr.WriteLine (a.vAmount);
	}
	
	
	
	sr.Close();
	print(fileName + " saved!");
}

function ReadFile(file : String)
{
	if(File.Exists(file))
	{
		var sr = File.OpenText(file);
		
			
			vUn.vName = sr.ReadLine();
			vUn.vMoney = int.Parse(sr.ReadLine());
			
			vUn.vCurrSec = int.Parse(sr.ReadLine());
			
			vUn.vCS.vName = sr.ReadLine();
			vUn.vCS.vClass = sr.ReadLine();
			vUn.vCS.vSpeed = float.Parse(sr.ReadLine());
			vUn.vCS.vMaxFuel = float.Parse(sr.ReadLine());
			vUn.vCS.vFuel = float.Parse(sr.ReadLine());
			vUn.vCS.vFuelUse = float.Parse(sr.ReadLine());
			vUn.vCS.vMaxHP = int.Parse(sr.ReadLine());
			vUn.vCS.vHP = int.Parse(sr.ReadLine());
			vUn.vCS.vMaxShield = int.Parse(sr.ReadLine());
			vUn.vCS.vCurrShield = int.Parse(sr.ReadLine());
			vUn.vCS.vStorage = int.Parse(sr.ReadLine());
			vUn.vCS.vStorageUsed = int.Parse(sr.ReadLine());
			
			vUn.vCS.vWeapon.vName = sr.ReadLine();
			vUn.vCS.vWeapon.vDmg = int.Parse(sr.ReadLine());
			vUn.vCS.vWeapon.vReloadtime = int.Parse(sr.ReadLine());
			//vUn.FindIcon();
			
			//load product amounts
			var b : int;
			b = int.Parse(sr.ReadLine());
			for(var i : int = 0; i < b; i++)
			{
				vUn.vSP[i].vAmount = int.Parse(sr.ReadLine());
			}
		  
	} 
	else 
	{
		Debug.Log("Could not Open the file: " + file + " for reading.");
		return;
	}
}
