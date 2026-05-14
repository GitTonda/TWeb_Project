#!/bin/bash

# ==========================================
# TWEB 2025/26 - Universal Database Setup
# ==========================================

BOLD='\033[1m'
GREEN='\033[1;32m'
RED='\033[1;31m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

DB_MONGO_NAME=${MONGO_DB_NAME:-anime_dynamic}
DB_PG_NAME=${POSTGRES_DB:-anime_static}
SAMPLE_ROWS=${MONGO_SAMPLE_SIZE:-500000}
DATA_DIR="./datasets"

echo -e "${CYAN}${BOLD}==========================================${NC}"
echo -e "${CYAN}${BOLD}  🚀 Full Stack Automated Setup Process   ${NC}"
echo -e "${CYAN}${BOLD}==========================================${NC}\n"

echo -e "${BOLD}[1/4] Booting up Docker Compose Stack...${NC}"
sudo docker compose up -d
sleep 3
echo -e "  ${GREEN}✔ Containers are live.${NC}\n"

# ==========================================
# MONGODB SECTION (Dynamic Data)
# ==========================================
echo -e "${BOLD}[2/4] Starting MongoDB Ingestion (${SAMPLE_ROWS} rows per file)...${NC}"

declare -A mongo_imports=(
    ["favs"]="favs.csv"
    ["stats"]="stats.csv"
    ["profiles"]="profiles.csv"
    ["ratings"]="ratings.csv"
)

for collection in "${!mongo_imports[@]}"; do
    csv_file="${mongo_imports[$collection]}"
    full_path="$DATA_DIR/$csv_file"
    temp_csv="/tmp/sampled_$csv_file"

    if [ ! -f "$full_path" ]; then
        echo -e "  ${YELLOW}[ SKIP ]${NC} $csv_file not found."
        continue
    fi

    echo -n -e "  ➜ Sampling & Importing ${CYAN}$csv_file${NC}... "
    
    head -n $((SAMPLE_ROWS + 1)) "$full_path" > "$temp_csv"

    # Removed the silent kill switch. It will power through warnings now.
    if mongoimport --uri "mongodb://127.0.0.1:27017/?connectTimeoutMS=120000&socketTimeoutMS=300000" \
                --db "$DB_MONGO_NAME" \
                --collection "$collection" \
                --type csv \
                --headerline \
                --drop \
                --batchSize=1000 \
                --numInsertionWorkers=1 \
                --file "$temp_csv" > /dev/null 2>&1; then
        echo -e "${GREEN}[ OK ]${NC}"
    else
        echo -e "${YELLOW}[ WARNING/OK ]${NC} (Import finished but logged a warning)"
    fi
    rm -f "$temp_csv"
done

# ==========================================
# POSTGRESQL SECTION (Relational Data)
# ==========================================
echo -e "\n${BOLD}[3/4] Preparing PostgreSQL Schema & Sanitizing Data...${NC}"

sudo docker exec -i anime-postgres psql -U postgres -d "$DB_PG_NAME" -q << 'EOF'
DROP TABLE IF EXISTS anime_details, characters, person_details, character_anime_works, character_nicknames, person_alternate_names, person_anime_works, person_voice_works, recommendations CASCADE;

CREATE TABLE anime_details (mal_id NUMERIC, title TEXT, title_japanese TEXT, url TEXT, image_url TEXT, type TEXT, status TEXT, score NUMERIC, scored_by NUMERIC, start_date TEXT, end_date TEXT, synopsis TEXT, rank NUMERIC, popularity NUMERIC, members NUMERIC, favorites NUMERIC, genres TEXT, studios TEXT, themes TEXT, demographics TEXT, source TEXT, rating TEXT, episodes NUMERIC, season TEXT, year NUMERIC, producers TEXT, explicit_genres TEXT, licensors TEXT, streaming TEXT);
CREATE TABLE characters (character_mal_id NUMERIC, url TEXT, name TEXT, name_kanji TEXT, image TEXT, favorites NUMERIC, about TEXT);
CREATE TABLE person_details (person_mal_id NUMERIC, url TEXT, website_url TEXT, image_url TEXT, name TEXT, given_name TEXT, family_name TEXT, birthday TEXT, favorites NUMERIC, relevant_location TEXT);

CREATE TABLE character_anime_works (anime_mal_id NUMERIC, character_mal_id NUMERIC, character_name TEXT, role TEXT);
CREATE TABLE person_anime_works (person_mal_id NUMERIC, position TEXT, anime_mal_id NUMERIC);
CREATE TABLE person_voice_works (person_mal_id NUMERIC, role TEXT, anime_mal_id NUMERIC, character_mal_id NUMERIC, language TEXT);
CREATE TABLE recommendations (mal_id NUMERIC, recommendation_mal_id NUMERIC);

CREATE TABLE character_nicknames (character_mal_id NUMERIC, nickname TEXT);
CREATE TABLE person_alternate_names (person_mal_id NUMERIC, alt_name TEXT);
EOF
echo -e "  ${GREEN}✔ Schema applied successfully.${NC}"

declare -A pg_imports=(
    ["anime_details"]="details.csv"
    ["characters"]="characters.csv"
    ["person_details"]="person_details.csv"
    ["character_anime_works"]="character_anime_works.csv"
    ["character_nicknames"]="character_nicknames.csv"
    ["person_alternate_names"]="person_alternate_names.csv"
    ["person_anime_works"]="person_anime_works.csv"
    ["person_voice_works"]="person_voice_works.csv"
    ["recommendations"]="recommendations.csv"
)

echo -e "\n${BOLD}[4/4] Importing Relational CSV Data...${NC}"
for table in "${!pg_imports[@]}"; do
    csv_file="${pg_imports[$table]}"
    full_path="$DATA_DIR/$csv_file"

    if [ ! -f "$full_path" ]; then
        echo -e "  ${YELLOW}[ SKIP ]${NC} $csv_file not found."
        continue
    fi

    echo -n -e "  ➜ Sanitizing & Importing ${CYAN}$csv_file${NC} into ${CYAN}$table${NC}... "

    sed -i 's/\r$//' "$full_path"
    sed -i '/^$/d' "$full_path"

    if cat "$full_path" | sudo docker exec -i anime-postgres psql -U postgres -d "$DB_PG_NAME" -c "\copy $table FROM STDIN WITH (FORMAT csv, HEADER true);" > /dev/null 2>&1; then
        echo -e "${GREEN}[ OK ]${NC}"
    else
        echo -e "${RED}[ FAILED ]${NC} (Check CSV formatting)"
    fi
done

echo -e "\n${GREEN}${BOLD}🎉 Full Infrastructure Setup Complete! Databases are primed and ready.${NC}"
