import os
ll = []
ll2 = []
m = {
'A':'B','C':'D','D':'E','F':'G','G':'A'}
for fname in os.listdir("./"):
	if "#" in fname:
		rawfilename = fname
		for (k,v) in m.items():
			if k in fname:
				fname = fname.replace(k,v)
				fname = fname.replace('#','b')
				print("org: %s to: %s"%(rawfilename, fname))
				os.rename(rawfilename, fname)
				break;