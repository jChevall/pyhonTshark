
# from bokeh.plotting import figure, output_file, show

# # prepare some data
# x = [1, 2, 3, 4, 5]
# y = [6, 7, 2, 4, 5]

# # output to static HTML file
# output_file("lines.html")

# # create a new plot with a title and axis labels
# p = figure(title="simple line example", x_axis_label='x', y_axis_label='y')

# # add a line renderer with legend and line thickness
# p.line(x, y, legend="Temp.", line_width=2)

# # show the results
# show(p)



import pandas as pd
from bokeh.plotting import output_file, Chord
from bokeh.io import show
from bokeh.sampledata.les_mis import data
 
nodes = data['nodes']
links = data['links']
 
nodes_df = pd.DataFrame(nodes)
links_df = pd.DataFrame(links)
 
source_data = links_df.merge(nodes_df, how='left', left_on='source', right_index=True)
source_data = source_data.merge(nodes_df, how='left', left_on='target', right_index=True)
source_data = source_data[source_data["value"] > 5]
source_data
 
chord_from_df = Chord(source_data, source="name_x", target="name_y", value="value")
output_file('chord-diagram-bokeh.html', mode="inline")
show(chord_from_df)
