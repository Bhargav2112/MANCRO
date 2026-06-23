import shutil
import os
import glob

brain_dir = r"C:\Users\bspar\.gemini\antigravity-ide\brain\64d67911-fd5a-49d4-a708-a3a7ee3d17c5"
dest_dir = r"C:\Users\bspar\OneDrive\Desktop\MANCRO\macro-watch\public"

print("Brain dir exists:", os.path.exists(brain_dir))
if os.path.exists(brain_dir):
    files = glob.glob(os.path.join(brain_dir, "media__*"))
    print("Found files:", files)
    for f in files:
        basename = os.path.basename(f)
        dest_path = os.path.join(dest_dir, basename)
        shutil.copy2(f, dest_path)
        print(f"Copied {basename} to {dest_path}")
else:
    print("Brain directory not found via python either.")
