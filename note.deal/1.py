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
				break;
		#ll2.append([os.stat(rawfilename).st_ctime_ns, "'%s',"%(fname.replace("wma","ogg"))])
		ll2.append([os.path.getmtime(rawfilename), "'%s',"%(fname.replace("wma","ogg"))])
		
	else:
		#ll.append([os.stat(fname).st_ctime_ns, "'%s',"%(fname.replace("wma","ogg"))])
		ll.append([os.path.getmtime(fname), "'%s',"%(fname.replace("wma","ogg"))])

ll.sort( key = lambda x:x[0])
ll2.sort( key = lambda x:x[0])
#print(ll)
for (x,y) in ll:
	print(y,end='')
print()
for (x,y) in ll2:
	print(y,end='')
#print("'%s %s',"%(fname.replace("wma","ogg"), os.stat(fname).st_ctime_ns), end="")
	