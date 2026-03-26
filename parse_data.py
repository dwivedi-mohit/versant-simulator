import re
import json

with open('raw_data.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# remove standalone numbers which are page numbers
text = re.sub(r'\n\s*\d+\s*\n', '\n', text)

sections = {}

# A: Repeats
m_repeats = re.search(r'Repeats:(.*?)(?=SENTENCE BUILDS:|SENTENCES BUILDS:)', text, re.DOTALL)
if m_repeats:
    rep_text = m_repeats.group(1)
    repeats = re.findall(r'\d+\.\s*(.*?)(?=\s+\d+\.|\Z)', rep_text, re.DOTALL)
    sections['A'] = [r.replace('\n', ' ').strip() for r in repeats if len(r.strip()) > 3]

# B: Sentence Builds
m_builds = re.search(r'SENTENCE BUILDS:(.*?)(?=SENTENCE COMPLETION::)', text, re.DOTALL)
if m_builds:
    b_text = m_builds.group(1)
    builds = []
    for m in re.finditer(r'\d+\)\s*(.*?)\s*A\)\s*(.*?)(?=\s+\d+\)|SENTENCES BUILDS:|\Z)', b_text, re.DOTALL):
        prompt = m.group(1).replace('\n', ' ').strip()
        ans = m.group(2).replace('\n', ' ').strip()
        builds.append({"prompt": prompt, "answer": ans})
    sections['B'] = builds

# E: Sentence Completion
m_comp = re.search(r'SENTENCE COMPLETION::(.*?)(?=DICTATIONS)', text, re.DOTALL)
if m_comp:
    c_text = m_comp.group(1)
    # usually starts with • or number. bullet points might be \u2022 or \u2981
    c_list = re.split(r'\n\s*(?:[•\u2022\u2981]|\d+\.)\s*', '\n' + c_text)
    sections['E'] = [c.replace('\n', ' ').strip() for c in c_list if len(c.strip()) > 5]

# D: Dictations
m_dict = re.search(r'DICTATIONS(.*?)(?=PASSAGE RECONSTRUCTION)', text, re.DOTALL)
if m_dict:
    d_text = m_dict.group(1)
    d_list = re.split(r'\n\s*(?:[•\u2022\u2981]|\d+\.)\s*', '\n' + d_text)
    sections['D'] = [d.replace('\n', ' ').strip() for d in d_list if len(d.strip()) > 5]

# F: Passage Reconstruction
m_pass = re.search(r'PASSAGE RECONSTRUCTION(.*?)(?=conversation -1|RECONSTRUCTED)', text, re.DOTALL)
if m_pass:
    p_text = m_pass.group(1)
    p_list = re.split(r'\n\s*(?:[•\u2022\u2981]|\d+\)|\d+\.)\s*', '\n' + p_text)
    sections['F'] = [p.replace('\n', ' ').strip() for p in p_list if len(p.strip()) > 10]

# C: Conversations
m_conv = re.search(r'conversation -1(.*)', text, re.DOTALL | re.IGNORECASE)
if m_conv:
    conv_text = '\n1. ' + m_conv.group(1)
    c_list = re.split(r'\n\s*\d+\.\s*', conv_text)
    sections['C'] = [c.strip() for c in c_list if len(c.strip()) > 10]

with open('data/parsed_questions.json', 'w', encoding='utf-8') as f:
    json.dump(sections, f, indent=2)

print(f"Parsed A: {len(sections.get('A', []))} items")
print(f"Parsed B: {len(sections.get('B', []))} items")
print(f"Parsed C: {len(sections.get('C', []))} items")
print(f"Parsed D: {len(sections.get('D', []))} items")
print(f"Parsed E: {len(sections.get('E', []))} items")
print(f"Parsed F: {len(sections.get('F', []))} items")
