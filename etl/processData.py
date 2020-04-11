import pandas as pd

# Read title data
rawTitle = pd.read_csv('inbound/title.basics.tsv', sep='\t', low_memory=False)

# Remove unwanted columns
keepCols = ['tconst', 'titleType', 'primaryTitle']
purgeCols = rawTitle[keepCols]

# Remove non-tvEpisode rows
episodesTitle = purgeCols[purgeCols['titleType'] == 'tvEpisode']
showsTitle = purgeCols[purgeCols['titleType'] == 'tvSeries']

# Remove titleType Col
keepCols = ['tconst', 'primaryTitle']
episodesTitle = episodesTitle[keepCols]
showsTitle = showsTitle[keepCols]
showsTitle.drop_duplicates(subset=None, inplace=True)

# Get Episode data
rawEpisodes = pd.read_csv('inbound/title.episode.tsv', sep='\t', low_memory=False)

# Merge Episode data and titles
episodeJoined = rawEpisodes.merge(episodesTitle, on='tconst')

# Get ratings
rawRatings = pd.read_csv('inbound/title.ratings.tsv', sep='\t', low_memory=False)
# Merge Episode data and ratings
episodeFinal = episodeJoined.merge(rawRatings, on='tconst')
episodeFinal.drop_duplicates(subset=None, inplace=True)

# Write files
newHeader = ['episodeID', 'showID', 'seasonNum', 'episodeNum', 'title', 'rating', 'numVotes']
episodeFinal.to_csv('processed/episodes.tsv', sep='\t', index=False, header=newHeader)
showsTitle.to_csv('processed/shows.tsv', sep='\t', index=False, header=['showID', 'title'])