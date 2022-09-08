class Global{
	static readonly KeyNotePath = './note/';
	static readonly PlainKeyName = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
	static readonly IntervalName = ['Perfect Unison','Minor 2nd', 'Major 2nd','Minor 3rd','Major 3rd',
		'Perfect 4th','Tritone', 'Perfect 5th','Minor 6th','Major 6th','Minor 7th', 'Major 7th','Perfect Octave'
		,'Minor 9th','Major 9th']
	static readonly KeyNoteMap = [
		['C1','D1b','D1','E1b','E1','F1','G1b','G1','A1b','A1','B1b','B1'],
		['C2','D2b','D2','E2b','E2','F2','G2b','G2','A2b','A2','B2b','B2'],
		['C3','D3b','D3','E3b','E3','F3','G3b','G3','A3b','A3','B3b','B3'],
		['C4','D4b','D4','E4b','E4','F4','G4b','G4','A4b','A4','B4b','B4'],
		['C5','D5b','D5','E5b','E5','F5','G5b','G5','A5b','A5','B5b','B5'],
		['C6','D6b','D6','E6b','E6','F6','G6b','G6','A6b','A6','B6b','B6'],
	];
	static KeyNoteNameMap: string[][] = function(){
		let trueMap:any = [];
		Global.KeyNoteMap.map((tmpArray) =>{
			let tmpk:any = [];
			tmpArray.forEach(x=> tmpk.push(x + ".ogg"));
			trueMap.push(tmpk);
		})
		return trueMap;
	}()
	static KeyNoteFullPath: string[][] = function(){
		let trueMap:any = [];
		Global.KeyNoteMap.map((tmpArray) =>{
			let tmpk:any = [];
			tmpArray.forEach(x=> tmpk.push(Global.KeyNotePath + x + ".ogg"));
			trueMap.push(tmpk);
		})
		return trueMap;
	}()
}

export default Global;
