package icon

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

type Type string

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t *Type) UnmarshalJSON(b []byte) error {
	var (
		s   string
		err error
	)

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	*t, err = stringToIcon(s)
	if err != nil {
		return err
	}

	return nil
}

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t Type) MarshalJSON() ([]byte, error) {
	s, err := iconToString(t)
	if err != nil {
		return []byte{}, err
	}

	return json.Marshal(s)
}

// Scan takes the value returned by the SQL database and maps it to [Type].
// So [Type] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t *Type) Scan(value any) error {
	var err error

	s, ok := value.(string)
	if !ok {
		return errors.New("icon: invalid column type")
	}

	*t, err = stringToIcon(s)
	if err != nil {
		return err
	}

	return nil
}

// Value returns the value of [Type] to be stored in the SQL database. So [Type]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t Type) Value() (driver.Value, error) {
	return iconToString(t)
}

func stringToIcon(s string) (Type, error) {
	switch strings.ToLower(s) {
	default:
		return FireExtinguisher, fmt.Errorf("icon: invalid value \"%s\"", s)
	case "credit_card":
		return CreditCard, nil
	case "landmark":
		return Landmark, nil
	case "vault":
		return Vault, nil
	case "banknote":
		return Banknote, nil
	case "hand_coins":
		return HandCoins, nil
	case "piggy_bank":
		return PiggyBank, nil
	case "wallet_card":
		return WalletCard, nil
	case "wallet_minimal":
		return WalletMinimal, nil
	case "car_front":
		return CarFront, nil
	case "car_taxi_front":
		return CarTaxiFront, nil
	case "ambulance":
		return Ambulance, nil
	case "cross":
		return Cross, nil
	case "hospital":
		return Hospital, nil
	case "bandage":
		return Bandage, nil
	case "heart_pulse":
		return HeartPulse, nil
	case "bone":
		return Bone, nil
	case "brain":
		return Brain, nil
	case "graduation_cap":
		return GraduationCap, nil
	case "dices":
		return Dices, nil
	case "school":
		return School, nil
	case "bitcoin":
		return Bitcoin, nil
	case "target":
		return Target, nil
	case "trophy":
		return Trophy, nil
	case "book":
		return Book, nil
	case "book_open":
		return BookOpen, nil
	case "bookmark":
		return Bookmark, nil
	case "notebook":
		return Notebook, nil
	case "ticket":
		return Ticket, nil
	case "tag":
		return Tag, nil
	case "tickets":
		return Tickets, nil
	case "fence":
		return Fence, nil
	case "train_front":
		return TrainFront, nil
	case "tv":
		return Tv, nil
	case "cigarette":
		return Cigarette, nil
	case "circle_parking":
		return CircleParking, nil
	case "container":
		return Container, nil
	case "fuel":
		return Fuel, nil
	case "luggage":
		return Luggage, nil
	case "plane":
		return Plane, nil
	case "ship":
		return Ship, nil
	case "briefcase":
		return Briefcase, nil
	case "clapperboard":
		return Clapperboard, nil
	case "film":
		return Film, nil
	case "popcorn":
		return Popcorn, nil
	case "dumbbell":
		return Dumbbell, nil
	case "biceps_flexed":
		return BicepsFlexed, nil
	case "mic_vocal":
		return MicVocal, nil
	case "piano":
		return Piano, nil
	case "headphones":
		return Headphones, nil
	case "computer":
		return Computer, nil
	case "binary":
		return Binary, nil
	case "cable":
		return Cable, nil
	case "cpu":
		return Cpu, nil
	case "laptop":
		return Laptop, nil
	case "pc_case":
		return PcCase, nil
	case "router":
		return Router, nil
	case "phone":
		return Phone, nil
	case "smartphone":
		return Smartphone, nil
	case "stethoscope":
		return Stethoscope, nil
	case "utility_pole":
		return UtilityPole, nil
	case "megaphone":
		return Megaphone, nil
	case "ethernet_port":
		return EthernetPort, nil
	case "earth":
		return Earth, nil
	case "globe":
		return Globe, nil
	case "shield":
		return Shield, nil
	case "volleyball":
		return Volleyball, nil
	case "ruler":
		return Ruler, nil
	case "calculator":
		return Calculator, nil
	case "music":
		return Music, nil
	case "drum":
		return Drum, nil
	case "theater":
		return Theater, nil
	case "shopping_bag":
		return ShoppingBag, nil
	case "shopping_basket":
		return ShoppingBasket, nil
	case "shopping_cart":
		return ShoppingCart, nil
	case "barcode":
		return Barcode, nil
	case "shirt":
		return Shirt, nil
	case "tent_tree":
		return TentTree, nil
	case "utensils":
		return Utensils, nil
	case "shower_head":
		return ShowerHead, nil
	case "washing_machine":
		return WashingMachine, nil
	case "bed_single":
		return BedSingle, nil
	case "bed_double":
		return BedDouble, nil
	case "bus_front":
		return BusFront, nil
	case "pill":
		return Pill, nil
	case "syringe":
		return Syringe, nil
	case "microscope":
		return Microscope, nil
	case "siren":
		return Siren, nil
	case "zap":
		return Zap, nil
	case "heater":
		return Heater, nil
	case "battery_charging":
		return BatteryCharging, nil
	case "user":
		return User, nil
	case "venetian_mask":
		return VenetianMask, nil
	case "house":
		return House, nil
	case "hammer":
		return Hammer, nil
	case "microwave":
		return Microwave, nil
	case "paint_roller":
		return PaintRoller, nil
	case "paintbrush_vertical":
		return PaintbrushVertical, nil
	case "tv_minimal_play":
		return TvMinimalPlay, nil
	case "wine":
		return Wine, nil
	case "medal":
		return Medal, nil
	case "crown":
		return Crown, nil
	case "milk":
		return Milk, nil
	case "glass_water":
		return GlassWater, nil
	case "droplet":
		return Droplet, nil
	case "hand_platter":
		return HandPlatter, nil
	case "fire_extinguisher":
		return FireExtinguisher, nil
	case "package":
		return Package, nil
	case "armchair":
		return Armchair, nil
	case "at_sign":
		return AtSign, nil
	case "cake":
		return Cake, nil
	case "building":
		return Building, nil
	case "cog":
		return Cog, nil
	case "id_card":
		return IdCard, nil
	case "mail":
		return Mail, nil
	case "search":
		return Search, nil
	case "binoculars":
		return Binoculars, nil
	case "tree_palm":
		return TreePalm, nil
	case "trees":
		return Trees, nil
	case "flower":
		return Flower, nil
	case "dog":
		return Dog, nil
	case "paw_print":
		return PawPrint, nil
	case "cat":
		return Cat, nil
	case "fish":
		return Fish, nil
	case "bird":
		return Bird, nil
	case "ice_cream_cone":
		return IceCreamCone, nil
	case "beef":
		return Beef, nil
	case "pizza":
		return Pizza, nil
	case "apple":
		return Apple, nil
	case "bean":
		return Bean, nil
	case "drumstick":
		return Drumstick, nil
	case "salad":
		return Salad, nil
	case "sandwich":
		return Sandwich, nil
	case "bike":
		return Bike, nil
	case "coins":
		return Coins, nil
	case "gamepad":
		return Gamepad, nil
	case "skull":
		return Skull, nil
	case "sword":
		return Sword, nil
	case "bell_electric":
		return BellElectric, nil
	case "heart":
		return Heart, nil
	case "clover":
		return Clover, nil
	case "monitor_play":
		return MonitorPlay, nil
	case "glasses":
		return Glasses, nil
	case "key_round":
		return KeyRound, nil
	case "candy":
		return Candy, nil
	case "baby":
		return Baby, nil
	}
}

func iconToString(t Type) (string, error) {
	switch t {
	default:
		return "", fmt.Errorf("icon: invalid value \"%s\"", string(t))
	case CreditCard:
		return "credit_card", nil
	case Landmark:
		return "landmark", nil
	case Vault:
		return "vault", nil
	case Banknote:
		return "banknote", nil
	case HandCoins:
		return "hand_coins", nil
	case PiggyBank:
		return "piggy_bank", nil
	case WalletCard:
		return "wallet_card", nil
	case WalletMinimal:
		return "wallet_minimal", nil
	case CarFront:
		return "car_front", nil
	case CarTaxiFront:
		return "car_taxi_front", nil
	case Ambulance:
		return "ambulance", nil
	case Cross:
		return "cross", nil
	case Hospital:
		return "hospital", nil
	case Bandage:
		return "bandage", nil
	case HeartPulse:
		return "heart_pulse", nil
	case Bone:
		return "bone", nil
	case Brain:
		return "brain", nil
	case GraduationCap:
		return "graduation_cap", nil
	case Dices:
		return "dices", nil
	case School:
		return "school", nil
	case Bitcoin:
		return "bitcoin", nil
	case Target:
		return "target", nil
	case Trophy:
		return "trophy", nil
	case Book:
		return "book", nil
	case BookOpen:
		return "book_open", nil
	case Bookmark:
		return "bookmark", nil
	case Notebook:
		return "notebook", nil
	case Ticket:
		return "ticket", nil
	case Tag:
		return "tag", nil
	case Tickets:
		return "tickets", nil
	case Fence:
		return "fence", nil
	case TrainFront:
		return "train_front", nil
	case Tv:
		return "tv", nil
	case Cigarette:
		return "cigarette", nil
	case CircleParking:
		return "circle_parking", nil
	case Container:
		return "container", nil
	case Fuel:
		return "fuel", nil
	case Luggage:
		return "luggage", nil
	case Plane:
		return "plane", nil
	case Ship:
		return "ship", nil
	case Briefcase:
		return "briefcase", nil
	case Clapperboard:
		return "clapperboard", nil
	case Film:
		return "film", nil
	case Popcorn:
		return "popcorn", nil
	case Dumbbell:
		return "dumbbell", nil
	case BicepsFlexed:
		return "biceps_flexed", nil
	case MicVocal:
		return "mic_vocal", nil
	case Piano:
		return "piano", nil
	case Headphones:
		return "headphones", nil
	case Computer:
		return "computer", nil
	case Binary:
		return "binary", nil
	case Cable:
		return "cable", nil
	case Cpu:
		return "cpu", nil
	case Laptop:
		return "laptop", nil
	case PcCase:
		return "pc_case", nil
	case Router:
		return "router", nil
	case Phone:
		return "phone", nil
	case Smartphone:
		return "smartphone", nil
	case Stethoscope:
		return "stethoscope", nil
	case UtilityPole:
		return "utility_pole", nil
	case Megaphone:
		return "megaphone", nil
	case EthernetPort:
		return "ethernet_port", nil
	case Earth:
		return "earth", nil
	case Globe:
		return "globe", nil
	case Shield:
		return "shield", nil
	case Volleyball:
		return "volleyball", nil
	case Ruler:
		return "ruler", nil
	case Calculator:
		return "calculator", nil
	case Music:
		return "music", nil
	case Drum:
		return "drum", nil
	case Theater:
		return "theater", nil
	case ShoppingBag:
		return "shopping_bag", nil
	case ShoppingBasket:
		return "shopping_basket", nil
	case ShoppingCart:
		return "shopping_cart", nil
	case Barcode:
		return "barcode", nil
	case Shirt:
		return "shirt", nil
	case TentTree:
		return "tent_tree", nil
	case Utensils:
		return "utensils", nil
	case ShowerHead:
		return "shower_head", nil
	case WashingMachine:
		return "washing_machine", nil
	case BedSingle:
		return "bed_single", nil
	case BedDouble:
		return "bed_double", nil
	case BusFront:
		return "bus_front", nil
	case Pill:
		return "pill", nil
	case Syringe:
		return "syringe", nil
	case Microscope:
		return "microscope", nil
	case Siren:
		return "siren", nil
	case Zap:
		return "zap", nil
	case Heater:
		return "heater", nil
	case BatteryCharging:
		return "battery_charging", nil
	case User:
		return "user", nil
	case VenetianMask:
		return "venetian_mask", nil
	case House:
		return "house", nil
	case Hammer:
		return "hammer", nil
	case Microwave:
		return "microwave", nil
	case PaintRoller:
		return "paint_roller", nil
	case PaintbrushVertical:
		return "paintbrush_vertical", nil
	case TvMinimalPlay:
		return "tv_minimal_play", nil
	case Wine:
		return "wine", nil
	case Medal:
		return "medal", nil
	case Crown:
		return "crown", nil
	case Milk:
		return "milk", nil
	case GlassWater:
		return "glass_water", nil
	case Droplet:
		return "droplet", nil
	case HandPlatter:
		return "hand_platter", nil
	case FireExtinguisher:
		return "fire_extinguisher", nil
	case Package:
		return "package", nil
	case Armchair:
		return "armchair", nil
	case AtSign:
		return "at_sign", nil
	case Cake:
		return "cake", nil
	case Building:
		return "building", nil
	case Cog:
		return "cog", nil
	case IdCard:
		return "id_card", nil
	case Mail:
		return "mail", nil
	case Search:
		return "search", nil
	case Binoculars:
		return "binoculars", nil
	case TreePalm:
		return "tree_palm", nil
	case Trees:
		return "trees", nil
	case Flower:
		return "flower", nil
	case Dog:
		return "dog", nil
	case PawPrint:
		return "paw_print", nil
	case Cat:
		return "cat", nil
	case Fish:
		return "fish", nil
	case Bird:
		return "bird", nil
	case IceCreamCone:
		return "ice_cream_cone", nil
	case Beef:
		return "beef", nil
	case Pizza:
		return "pizza", nil
	case Apple:
		return "apple", nil
	case Bean:
		return "bean", nil
	case Drumstick:
		return "drumstick", nil
	case Salad:
		return "salad", nil
	case Sandwich:
		return "sandwich", nil
	case Bike:
		return "bike", nil
	case Coins:
		return "coins", nil
	case Gamepad:
		return "gamepad", nil
	case Skull:
		return "skull", nil
	case Sword:
		return "sword", nil
	case BellElectric:
		return "bell_electric", nil
	case Heart:
		return "heart", nil
	case Clover:
		return "clover", nil
	case MonitorPlay:
		return "monitor_play", nil
	case Glasses:
		return "glasses", nil
	case KeyRound:
		return "key_round", nil
	case Candy:
		return "candy", nil
	case Baby:
		return "baby", nil
	}
}
