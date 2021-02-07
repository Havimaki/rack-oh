const MOVE_TYPES = {
  SHOW_PLAYERS_HAND: "showPlayersHand",
  SHOW_DISCARD_PILE: "showDiscardPile",
  SELECT_CARD_FROM_DISCARD_PILE: "selectCardFromDiscardPile",
  SELECT_CARD_FROM_MAIN_DECK: "selectCardFromMainDeck",
  SELECT_CARD_FROM_HAND: "selectCardFromHand",
  SWAP_CARDS: "swardCards"
}

const REDIS_KEYS = {
  PLAYER: '{PLAYER}:'
}

module.exports = {
  MOVE_TYPES,
  REDIS_KEYS
}