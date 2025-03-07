package util

import (
	"encoding/binary"
	"hash/fnv"
	"math/rand"
)

func GeneratePredict(userID string, maxNumber int) ([]int, error) {

	hasher := fnv.New64()
	hasher.Write([]byte(userID))
	seed := binary.BigEndian.Uint64(hasher.Sum(nil))

	rnd := rand.New(rand.NewSource(int64(seed)))

	numbers := make([]int, maxNumber)
	for i := 0; i < maxNumber; i++ {
		numbers[i] = i + 1
	}

	for i := maxNumber - 1; i > maxNumber-6; i-- {
		j := rnd.Intn(i + 1)
		numbers[i], numbers[j] = numbers[j], numbers[i]
	}
	return numbers[maxNumber-5:], nil
}
